<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-file-document-multiple</v-icon>
        Документы
        <v-spacer />
        <v-btn class="mt-4" color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Добавить документ
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-select v-model="selectedEmployeeId" :items="employeeOptions" item-title="text" item-value="value"
              label="Фильтр по сотруднику" clearable @update:model-value="filterDocuments" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="selectedDocumentType" :items="documentTypeOptions" label="Тип документа" clearable
              @update:model-value="filterDocuments" />
          </v-col>
          <v-col cols="12" md="4">
            <v-btn color="secondary" @click="clearFilters" block>
              <v-icon left>mdi-filter-remove</v-icon>
              Очистить фильтры
            </v-btn>
          </v-col>
        </v-row>

        <v-data-table :headers="headers" :items="documentsWithEmployee" :loading="documentStore.loading"
          :server-items-length="documentStore.pagination.total" @update:options="handleTableOptions"
          class="elevation-1">
          <template #item.documentType="{ item }">
            <v-chip :color="item.documentType === 'счет-фактура' ? 'blue' : 'green'" :text="item.documentType"
              size="small" />
          </template>

          <template #item.employeeName="{ item }">
            <router-link :to="`/employees/${item.employeeId}`">
              {{ item.employeeName }}
            </router-link>
          </template>

          <template #item.actions="{ item }">
            <div style="display: flex; gap: 4px;">
              <v-btn icon size="small" :to="`/documents/${item.id}`" color="primary">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="editDocument(item)" color="orange">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="deleteDocument(item.id)" color="red">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Document Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="800px">
      <v-card>
        <v-card-title>
          {{ editingDocument ? 'Редактировать документ' : 'Создать документ' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="saveDocument">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="documentForm.documentType" :items="documentTypeOptions" label="Тип документа*"
                  :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="documentForm.documentNumber" label="Номер документа*" :rules="[rules.required]"
                  required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="documentForm.documentDate" label="Дата документа*" type="date"
                  :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="documentForm.employeeId" :items="employeeOptions" item-title="text"
                  item-value="value" label="Сотрудник*" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="documentForm.description" label="Описание*" :rules="[rules.required]" required />
              </v-col>

              <!-- Invoice specific fields -->
              <v-col v-if="documentForm.documentType === 'счет-фактура'" cols="12" sm="6">
                <v-select v-model="documentForm.invoiceType" :items="invoiceTypeOptions" label="Тип счет-фактуры*"
                  :rules="[rules.required]" required />
              </v-col>

              <!-- Power of attorney specific fields -->
              <v-col v-if="documentForm.documentType === 'доверенность'" cols="12" sm="6">
                <v-text-field v-model="documentForm.authorizedPersonName" label="ФИО доверенного человека*"
                  :rules="[rules.required]" required />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveDocument">
            {{ editingDocument ? 'Обновить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить этот документ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">Отмена</v-btn>
          <v-btn color="red" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

// Update the script section of your document component

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/document'
import { useEmployeeStore } from '../../stores/employee'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()
const employeeStore = useEmployeeStore()

// Reactive variables
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const editingDocument = ref(null)
const documentToDelete = ref(null)
const valid = ref(false)
const selectedEmployeeId = ref(null)
const selectedDocumentType = ref(null)

// Form data
const documentForm = reactive({
  documentType: '',
  documentNumber: '',
  documentDate: '',
  description: '',
  employeeId: null,
  invoiceType: '',
  authorizedPersonName: ''
})

// Table headers
const headers = [
  { title: 'Тип', value: 'documentType' },
  { title: 'Номер', value: 'documentNumber' },
  { title: 'Дата', value: 'documentDate' },
  { title: 'Сотрудник', value: 'employeeName' },
  { title: 'Описание', value: 'description' },
  { title: 'Действия', value: 'actions', sortable: false }
]

// Form options
const documentTypeOptions = ['счет-фактура', 'доверенность']
const invoiceTypeOptions = ['Стандартная', 'Дополнительная']

// Computed properties
const employeeOptions = computed(() => {
  return employeeStore.employees.map(emp => ({
    text: `${emp.firstName} ${emp.lastName}`,
    value: emp.id
  }))
})

const documentsWithEmployee = computed(() => {
  return documentStore.documents.map(doc => {
    const employee = employeeStore.employees.find(emp => emp.id === doc.employeeId)
    return {
      ...doc,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Не найден'
    }
  })
})

// Validation rules
const rules = {
  required: (value) => !!value || 'Обязательное поле'
}

// Updated Methods with URL query parameters
const updateUrlQuery = (params) => {
  const query = { ...route.query }
  
  // Update query parameters
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      query[key] = params[key].toString()
    } else {
      delete query[key]
    }
  })
  
  // Update the URL
  router.push({ query })
}

const handleTableOptions = (options) => {
  // Update URL with pagination parameters
  updateUrlQuery({
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    employeeId: selectedEmployeeId.value
  })
  
  documentStore.fetchDocuments(options.page, options.itemsPerPage, selectedEmployeeId.value)
}

const filterDocuments = () => {
  // Update URL with filter parameters
  updateUrlQuery({
    page: 1,
    itemsPerPage: documentStore.pagination.itemsPerPage,
    employeeId: selectedEmployeeId.value,
    documentType: selectedDocumentType.value
  })
  
  documentStore.fetchDocuments(1, documentStore.pagination.itemsPerPage, selectedEmployeeId.value)
}

const clearFilters = () => {
  selectedEmployeeId.value = null
  selectedDocumentType.value = null
  
  // Clear URL query parameters
  updateUrlQuery({
    page: 1,
    itemsPerPage: 10,
    employeeId: null,
    documentType: null
  })
  
  documentStore.fetchDocuments(1, 10)
}

const editDocument = (document) => {
  editingDocument.value = document
  Object.assign(documentForm, document)
  showCreateDialog.value = true
}

const deleteDocument = (id) => {
  documentToDelete.value = id
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  await documentStore.deleteDocument(documentToDelete.value)
  showDeleteDialog.value = false
  documentToDelete.value = null
}

const saveDocument = async () => {
  if (!valid.value) return

  try {
    // Clean up form data based on document type
    const cleanedForm = { ...documentForm }

    if (cleanedForm.documentType === 'счет-фактура') {
      delete cleanedForm.authorizedPersonName
    } else if (cleanedForm.documentType === 'доверенность') {
      delete cleanedForm.invoiceType
    }

    if (editingDocument.value) {
      await documentStore.updateDocument(editingDocument.value.id, cleanedForm)
    } else {
      await documentStore.createDocument(cleanedForm)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving document:', error)
  }
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingDocument.value = null
  Object.assign(documentForm, {
    documentType: '',
    documentNumber: '',
    documentDate: '',
    description: '',
    employeeId: null,
    invoiceType: '',
    authorizedPersonName: ''
  })
}

// Initialize from URL query parameters
const initializeFromQuery = () => {
  const { page, itemsPerPage, employeeId, documentType } = route.query
  
  if (employeeId) {
    selectedEmployeeId.value = parseInt(employeeId)
  }
  
  if (documentType) {
    selectedDocumentType.value = documentType
  }
  
  const currentPage = page ? parseInt(page) : 1
  const currentItemsPerPage = itemsPerPage ? parseInt(itemsPerPage) : 10
  
  documentStore.fetchDocuments(currentPage, currentItemsPerPage, selectedEmployeeId.value)
}

// Watch for route query changes
watch(() => route.query, (newQuery) => {
  initializeFromQuery()
}, { immediate: false })

// Load data on component mount
onMounted(async () => {
  await employeeStore.fetchEmployees(1, 100) // Load all employees for filter
  initializeFromQuery()
})
</script>