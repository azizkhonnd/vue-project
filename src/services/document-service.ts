import type { DocumentResponse } from 'types'
import api from './api'


export const documentService = {
  // Get all documents with pagination and filtering
  async getDocuments(page = 1, limit = 10, employeeId: number | null = null): Promise<DocumentResponse> {
    try {
      let url = `/documents?_page=${page}&_limit=${limit}`
      
      if (employeeId) {
        url += `&employeeId=${employeeId}`
      }
      
      const response = await api.get(url)
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count']) || 0,
        page,
        limit
      }
    } catch (error) {
      throw new Error('Ошибка при получении списка документов')
    }
  },

  // Get document by ID
  async getDocumentById(id: number) {
    try {
      const response = await api.get(`/documents/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при получении данных документа')
    }
  },

  // Create new document
  async createDocument(documentData: any) {
    try {
      const response = await api.post('/documents', documentData)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при создании документа')
    }
  },

  // Update document
  async updateDocument(id: number, documentData: any) {
    try {
      const response = await api.put(`/documents/${id}`, documentData)
      return response.data
    } catch (error) {
      throw new Error('Ошибка при обновлении документа')
    }
  },

  // Delete document
  async deleteDocument(id: number) {
    try {
      await api.delete(`/documents/${id}`)
      return true
    } catch (error) {
      throw new Error('Ошибка при удалении документа')
    }
  }
}
