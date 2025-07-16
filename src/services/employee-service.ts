import api from './api'

export const employeeService = {
  // Get all employees with pagination
  async getEmployees(page = 1, limit = 10): Promise<EmployeeResponse> {
    try {
      const response = await api.get(`/employees?_page=${page}&_limit=${limit}`)
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count']) || 0,
        page,
        limit
      }
    } catch (error) {
      throw new Error('Ошибка при получении списка сотрудников')
    }
  },

  // Get employee by ID
  async getEmployeeById(id: number) {
    try {
      const response = await api.get(`/employees/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при получении данных сотрудника')
    }
  },

  // Create new employee
  async createEmployee(employeeData: any) {
    try {
      const response = await api.post('/employees', employeeData)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при создании сотрудника')
    }
  },

  // Update employee
  async updateEmployee(id: number, employeeData: any) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при обновлении сотрудника')
    }
  },

  // Delete employee
  async deleteEmployee(id: number) {
    try {
      await api.delete(`/employees/${id}`)
      return true
    } catch (error) {
      throw new Error('Ошибка при удалении сотрудника')
    }
  }
}

// File: src/stores/employee.ts (Note: stores, not store)
import { defineStore } from 'pinia'
import type { Employee, EmployeeCreateData, EmployeeResponse, PaginationData } from 'types'
import { ref, computed } from 'vue'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationData>({
    page: 1,
    itemsPerPage: 10,
    total: 0,
    totalPages: 0
  })

  // Getters
  const activeEmployees = computed(() =>
    employees.value.filter(emp => emp.isActive)
  )

  const employeeCount = computed(() => employees.value.length)

  // Actions
  const fetchEmployees = async (page = 1, itemsPerPage = 10) => {
    loading.value = true
    error.value = null

    try {
      const response = await employeeService.getEmployees(page, itemsPerPage)
      employees.value = response.data
      pagination.value = {
        page,
        itemsPerPage,
        total: response.total,
        totalPages: Math.ceil(response.total / itemsPerPage)
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке сотрудников'
      console.error('Error fetching employees:', err)
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (employeeData: EmployeeCreateData) => {
    loading.value = true
    error.value = null

    try {
      const newEmployee = await employeeService.createEmployee(employeeData)
      employees.value.push(newEmployee)
      return newEmployee
    } catch (err) {
      error.value = 'Ошибка при создании сотрудника'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id: number, employeeData: Partial<EmployeeCreateData>) => {
    loading.value = true
    error.value = null

    try {
      const updatedEmployee = await employeeService.updateEmployee(id, employeeData)
      const index = employees.value.findIndex(emp => emp.id === id)

      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }

      return updatedEmployee
    } catch (err) {
      error.value = 'Ошибка при обновлении сотрудника'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await employeeService.deleteEmployee(id)
      employees.value = employees.value.filter(emp => emp.id !== id)
    } catch (err) {
      error.value = 'Ошибка при удалении сотрудника'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getEmployeeById = (id: number): Employee | undefined => {
    return employees.value.find(emp => emp.id === id)
  }

  return {
    // State
    employees,
    loading,
    error,
    pagination,

    // Getters
    activeEmployees,
    employeeCount,

    // Actions
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
  }
})
