export interface Document {
    id: number
    documentNumber: string
    documentType: 'счет-фактура' | 'договор' | 'акт' | 'накладная'
    createdDate: string
    author: string
    status: 'активный' | 'черновик' | 'архив' | 'отклонен' | 'на рассмотрении'
    description?: string
    views?: number
    lastModified: string
    employeeId?: number
}

export interface DocumentCreateData {
    documentNumber: string
    documentType: 'счет-фактура' | 'договор' | 'акт' | 'накладная'
    author: string
    status: 'активный' | 'черновик' | 'архив' | 'отклонен' | 'на рассмотрении'
    description?: string
    employeeId?: number
}

//Employees
export interface EmployeeResponse {
    data: any[]
    total: number
    page: number
    limit: number
}

export interface Employee {
    id: number
    firstName: string
    lastName: string
    birthDate: string
    passportNumber: string
    gender: 'Не указан' | 'Мужской' | 'Женский'
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface EmployeeCreateData {
    firstName: string
    lastName: string
    birthDate: string
    passportNumber: string
    gender: 'Не указан' | 'Мужской' | 'Женский'
    isActive: boolean
}

export interface PaginationData {
    page: number
    itemsPerPage: number
    total: number
    totalPages: number
}

export interface Employee {
    id: number
    firstName: string
    lastName: string
    birthDate: string
    passportNumber: string
    gender: 'Не указан' | 'Мужской' | 'Женский'
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface EmployeeCreateData {
    firstName: string
    lastName: string
    birthDate: string
    passportNumber: string
    gender: 'Не указан' | 'Мужской' | 'Женский'
    isActive: boolean
}

export interface PaginationData {
    page: number
    itemsPerPage: number
    total: number
    totalPages: number
}

//Document Service
export interface DocumentResponse {
    data: any[]
    total: number
    page: number
    limit: number
}