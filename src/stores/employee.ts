import { employeeService } from '../services/employee-service'
import { defineStore } from 'pinia'
import type { Employee, EmployeeCreateData, PaginationData } from 'types'
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
