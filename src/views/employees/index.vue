<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-account-group</v-icon>
        Сотрудники
        <v-spacer />
        <v-btn class="mt-4" color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Добавить сотрудника
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table :headers="headers" :items="employeeStore.employees" :loading="employeeStore.loading"
          :server-items-length="employeeStore.pagination.total" @update:options="handleTableOptions"
          class="elevation-1">
          <template #item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'red'" :text="item.isActive ? 'Активен' : 'Неактивен'"
              size="small" />
          </template>

          <template #item.actions="{ item }">
            <div style="display: flex; gap: 4px;">
              <v-btn icon size="small" :to="`/employees/${item.id}`" color="primary">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="editEmployee(item)" color="orange">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="deleteEmployee(item.id)" color="red">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Employee Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingEmployee ? 'Редактировать сотрудника' : 'Создать сотрудника' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="saveEmployee">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="employeeForm.firstName" label="Имя*" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="employeeForm.lastName" label="Фамилия*" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="employeeForm.birthDate" label="Дата рождения" type="date" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="employeeForm.passportNumber" label="Серия и номер паспорта*"
                  :rules="[rules.required, rules.passport]" placeholder="AD1234567" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="employeeForm.gender" label="Пол" :items="genderOptions" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch v-model="employeeForm.isActive" label="Активность" color="primary" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveEmployee">
            {{ editingEmployee ? 'Обновить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить этого сотрудника?
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

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employee'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()

// Reactive variables
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const editingEmployee = ref(null)
const employeeToDelete = ref(null)
const valid = ref(false)

// Form data
const employeeForm = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  passportNumber: '',
  gender: 'Не указан',
  isActive: true
})

// Table headers
const headers = [
  { title: 'Имя', value: 'firstName' },
  { title: 'Фамилия', value: 'lastName' },
  { title: 'Дата рождения', value: 'birthDate' },
  { title: 'Номер паспорта', value: 'passportNumber' },
  { title: 'Пол', value: 'gender' },
  { title: 'Статус', value: 'isActive' },
  { title: 'Действия', value: 'actions', sortable: false }
]

// Form options
const genderOptions = ['Не указан', 'Мужской', 'Женский']

// Validation rules
const rules = {
  required: (value) => !!value || 'Обязательное поле',
  passport: (value) => {
    const pattern = /^[A-Z]{2}\d{7}$/
    return pattern.test(value) || 'Неправильный формат паспорта (например: AD1234567)'
  }
}

const updateUrlQuery = (params) => {
  const query = { ...route.query }
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      query[key] = params[key].toString()
    } else {
      delete query[key]
    }
  })
  
  router.push({ query })
}

const handleTableOptions = (options) => {
  updateUrlQuery({
    page: options.page,
    itemsPerPage: options.itemsPerPage
  })
  
  employeeStore.fetchEmployees(options.page, options.itemsPerPage)
}

const editEmployee = (employee) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, employee)
  showCreateDialog.value = true
}

const deleteEmployee = (id) => {
  employeeToDelete.value = id
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  await employeeStore.deleteEmployee(employeeToDelete.value)
  showDeleteDialog.value = false
  employeeToDelete.value = null
}

const saveEmployee = async () => {
  if (!valid.value) return

  try {
    if (editingEmployee.value) {
      await employeeStore.updateEmployee(editingEmployee.value.id, employeeForm)
    } else {
      await employeeStore.createEmployee(employeeForm)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving employee:', error)
  }
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingEmployee.value = null
  Object.assign(employeeForm, {
    firstName: '',
    lastName: '',
    birthDate: '',
    passportNumber: '',
    gender: 'Не указан',
    isActive: true
  })
}

const initializeFromQuery = () => {
  const { page, itemsPerPage } = route.query
  
  const currentPage = page ? parseInt(page) : 1
  const currentItemsPerPage = itemsPerPage ? parseInt(itemsPerPage) : 10
  
  employeeStore.fetchEmployees(currentPage, currentItemsPerPage)
}

watch(() => route.query, (newQuery) => {
  initializeFromQuery()
}, { immediate: false })

onMounted(() => {
  initializeFromQuery()
})
</script>