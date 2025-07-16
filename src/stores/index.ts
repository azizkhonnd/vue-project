import { createPinia } from 'pinia'

export const pinia = createPinia()
export { useEmployeeStore } from './employee'
export { useDocumentStore } from './document'
export { useSidebarStore } from './sidebar'
