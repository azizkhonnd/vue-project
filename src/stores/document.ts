import { documentService } from '../services/document-service'
import { defineStore } from 'pinia'
import type { DocumentCreateData, Document } from 'types'
import { ref, computed } from 'vue'


export const useDocumentStore = defineStore('document', () => {
  // State
  const documents = ref<Document[]>([])
  const currentDocument = ref<Document | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
    total: 0,
    totalPages: 0
  })

  // Getters
  const activeDocuments = computed(() => 
    documents.value.filter(doc => doc.status === 'активный')
  )
  
  const documentCount = computed(() => documents.value.length)

  // Actions
  const fetchDocuments = async (page = 1, itemsPerPage = 10, employeeId: number | null = null) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await documentService.getDocuments(page, itemsPerPage, employeeId)
      documents.value = response.data
      pagination.value = {
        page,
        itemsPerPage,
        total: response.total,
        totalPages: Math.ceil(response.total / itemsPerPage)
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке документов'
      console.error('Error fetching documents:', err)
    } finally {
      loading.value = false
    }
  }

  const loadDocument = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const document = await documentService.getDocumentById(id)
      currentDocument.value = document
      return document
    } catch (err) {
      error.value = 'Ошибка при загрузке документа'
      console.error('Error loading document:', err)
    } finally {
      loading.value = false
    }
  }

  const createDocument = async (documentData: DocumentCreateData) => {
    loading.value = true
    error.value = null
    
    try {
      const newDocument = await documentService.createDocument(documentData)
      documents.value.push(newDocument)
      return newDocument
    } catch (err) {
      error.value = 'Ошибка при создании документа'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDocument = async (id: number, documentData: Partial<DocumentCreateData>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedDocument = await documentService.updateDocument(id, documentData)
      const index = documents.value.findIndex(doc => doc.id === id)
      
      if (index !== -1) {
        documents.value[index] = updatedDocument
      }
      
      if (currentDocument.value?.id === id) {
        currentDocument.value = updatedDocument
      }
      
      return updatedDocument
    } catch (err) {
      error.value = 'Ошибка при обновлении документа'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDocument = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await documentService.deleteDocument(id)
      documents.value = documents.value.filter(doc => doc.id !== id)
      
      if (currentDocument.value?.id === id) {
        currentDocument.value = null
      }
    } catch (err) {
      error.value = 'Ошибка при удалении документа'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getDocumentById = (id: number): Document | undefined => {
    return documents.value.find(doc => doc.id === id)
  }

  return {
    // State
    documents,
    currentDocument,
    loading,
    error,
    pagination,
    
    // Getters
    activeDocuments,
    documentCount,
    
    // Actions
    fetchDocuments,
    loadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById
  }
})