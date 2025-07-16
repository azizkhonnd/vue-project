<template>
  <div>
    <v-card v-if="employeeStore.currentEmployee">
      <v-card-title>
        <v-btn
          icon
          @click="$router.go(-1)"
          class="mr-2"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-icon class="mr-2">mdi-account</v-icon>
        {{ employeeStore.currentEmployee.firstName }} {{ employeeStore.currentEmployee.lastName }}
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title>
                <v-icon class="mr-2">mdi-account-details</v-icon>
                Основная информация
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Имя</v-list-item-title>
                      <v-list-item-subtitle>{{ employeeStore.currentEmployee.firstName }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Фамилия</v-list-item-title>
                      <v-list-item-subtitle>{{ employeeStore.currentEmployee.lastName }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-calendar</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Дата рождения</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(employeeStore.currentEmployee.birthDate) }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-card-account-details</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Номер паспорта</v-list-item-title>
                      <v-list-item-subtitle>{{ employeeStore.currentEmployee.passportNumber }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-gender-male-female</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Пол</v-list-item-title>
                      <v-list-item-subtitle>{{ employeeStore.currentEmployee.gender }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-toggle-switch</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Статус</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip
                          :color="employeeStore.currentEmployee.isActive ? 'green' : 'red'"
                          :text="employeeStore.currentEmployee.isActive ? 'Активен' : 'Неактивен'"
                          size="small"
                        />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title>
                <v-icon class="mr-2">mdi-file-document-multiple</v-icon>
                Документы сотрудника
                <v-spacer />
                <v-btn
                  color="primary"
                  size="small"
                  :to="`/documents?employeeId=${employeeStore.currentEmployee.id}`"
                >
                  Посмотреть все
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-list v-if="employeeDocuments.length > 0">
                  <v-list-item
                    v-for="document in employeeDocuments"
                    :key="document.id"
                    :to="`/documents/${document.id}`"
                  >
                    <v-list-item-avatar>
                      <v-icon>
                        {{ document.documentType === 'счет-фактура' ? 'mdi-receipt' : 'mdi-file-document' }}
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ document.documentNumber }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ document.documentType }} - {{ formatDate(document.documentDate) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-alert v-else type="info" text>
                  У данного сотрудника нет документов
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="editEmployee"
        >
          <v-icon left>mdi-pencil</v-icon>
          Редактировать
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <v-card v-else-if="employeeStore.loading">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-4">Загрузка...</p>
      </v-card-text>
    </v-card>
    
    <v-card v-else>
      <v-card-text>
        <v-alert type="error" text>
          Сотрудник не найден
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/store/employee'
import { useDocumentStore } from '@/store/document'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const documentStore = useDocumentStore()

const employeeId = computed(() => route.params.id)

// Compute employee documents
const employeeDocuments = computed(() => {
  return documentStore.documents.filter(doc => doc.employeeId === parseInt(employeeId.value))
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'Не указана'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const editEmployee = () => {
  // Navigate back to employees list with edit mode
  router.push({
    name: 'Employees',
    query: { edit: employeeId.value }
  })
}

// Load data on component mount
onMounted(async () => {
  await employeeStore.fetchEmployeeById(employeeId.value)
  // Load documents for this employee
  await documentStore.fetchDocuments(1, 5, employeeId.value)
})
</script>