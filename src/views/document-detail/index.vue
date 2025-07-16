<template>
  <div>
    <v-card v-if="documentStore.currentDocument">
      <v-card-title>
        <v-btn icon @click="$router.go(-1)" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-icon class="mr-2">
          {{ documentStore.currentDocument.documentType === 'счет-фактура' ? 'mdi-receipt' : 'mdi-file-document' }}
        </v-icon>
        {{ documentStore.currentDocument.documentNumber }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-card outlined>
              <v-card-title>
                <v-icon class="mr-2">mdi-information</v-icon>
                Основная информация
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-file-document</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Тип документа</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip
                          :color="documentStore.currentDocument.documentType === 'счет-фактура' ? 'blue' : 'green'"
                          :text="documentStore.currentDocument.documentType" size="small" />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-identifier</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Номер документа</v-list-item-title>
                      <v-list-item-subtitle>{{ documentStore.currentDocument.documentNumber }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-calendar</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Дата создания</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(documentStore.currentDocument.createdDate)
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Автор</v-list-item-title>
                      <v-list-item-subtitle>{{ documentStore.currentDocument.author }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-flag</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Статус</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip :color="getStatusColor(documentStore.currentDocument.status)"
                          :text="documentStore.currentDocument.status" size="small" />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-icon class="mr-2">mdi-cog</v-icon>
                Действия
              </v-card-title>
              <v-card-text>
                <v-btn block color="primary" class="mb-2" @click="editDocument">
                  <v-icon left>mdi-pencil</v-icon>
                  Редактировать
                </v-btn>

                <v-btn block color="success" class="mb-2" @click="downloadDocument">
                  <v-icon left>mdi-download</v-icon>
                  Скачать
                </v-btn>

                <v-btn block color="info" class="mb-2" @click="shareDocument">
                  <v-icon left>mdi-share</v-icon>
                  Поделиться
                </v-btn>

                <v-btn block color="error" @click="deleteDocument">
                  <v-icon left>mdi-delete</v-icon>
                  Удалить
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title>
                <v-icon class="mr-2">mdi-chart-line</v-icon>
                Статистика
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Просмотры</v-list-item-title>
                      <v-list-item-subtitle>{{ documentStore.currentDocument.views || 0 }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>mdi-calendar-clock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Последнее изменение</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(documentStore.currentDocument.lastModified)
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="documentStore.currentDocument.description" class="mt-4">
          <v-col cols="12">
            <v-card outlined>
              <v-card-title>
                <v-icon class="mr-2">mdi-text</v-icon>
                Описание
              </v-card-title>
              <v-card-text>
                {{ documentStore.currentDocument.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-text class="text-center">
        <v-icon size="64" color="grey">mdi-file-question</v-icon>
        <h3 class="mt-2">Документ не найден</h3>
        <p class="text--secondary">Запрашиваемый документ не существует или был удален.</p>
        <v-btn color="primary" @click="$router.push('/documents')">
          Вернуться к списку документов
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useDocumentStore } from '@/stores/documentStore'

export default {
  name: 'DocumentDetailView',

  computed: {
    ...mapStores(useDocumentStore)
  },

  methods: {
    formatDate(date) {
      if (!date) return 'Не указано'
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getStatusColor(status) {
      const statusColors = {
        'активный': 'success',
        'черновик': 'warning',
        'архив': 'grey',
        'отклонен': 'error',
        'на рассмотрении': 'info'
      }
      return statusColors[status] || 'primary'
    },

    editDocument() {
      this.$router.push(`/documents/${this.documentStore.currentDocument.id}/edit`)
    },

    downloadDocument() {
      // Implement download functionality
      console.log('Downloading document:', this.documentStore.currentDocument.id)
    },

    shareDocument() {
      // Implement share functionality
      console.log('Sharing document:', this.documentStore.currentDocument.id)
    },

    deleteDocument() {
      if (confirm('Вы уверены, что хотите удалить этот документ?')) {
        this.documentStore.deleteDocument(this.documentStore.currentDocument.id)
        this.$router.push('/documents')
      }
    }
  },

  mounted() {
    // If document ID is provided in route params, load the document
    if (this.$route.params.id) {
      this.documentStore.loadDocument(this.$route.params.id)
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}

.v-list-item-avatar {
  min-width: 40px;
}

.v-chip {
  text-transform: capitalize;
}
</style>