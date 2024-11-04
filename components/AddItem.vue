<template>
  <div class="container mt-5">
    <div class="text-center mb-5"> 
      <h4><strong>AGREGAR ÍTEM</strong></h4>
    </div>
    <form @submit.prevent="submitForm">
      
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="form.title"
          required
        />
      </div>

      
      <div class="mb-3">
        <label for="author" class="form-label">Autor</label>
        <input
          type="text"
          class="form-control"
          id="author"
          v-model="form.author"
          required
        />
      </div>

      
      <div class="mb-3">
        <label for="file" class="form-label">Archivo (foto, PDF, etc.)</label>
        <input
          type="file"
          class="form-control"
          id="file"
          @change="handleFileUpload"
          required
        />
      </div>

      <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
    <div class="text-center mb-5"> 
     <button type="button" class="btn btn-dark" @click="getItems">Obtener Items</button>
    </div>
    <div v-if="existenItems" >
        <h3>ITEMS</h3>
        <ul>
            <li v-for="item in items">
                {{item}}
            </li>
        </ul>
    </div>
    auth: {{ authToken }} xsrf:
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import axios from 'axios';


interface FormData {
  title: string;
  author: string;
  file: File | null;
}

const form = ref<FormData>({
  title: '',
  author: '',
  file: null,
});

const emit = defineEmits<{ (e: 'submit-item', data: FormData): void }>();

const resetForm = () => {
  form.value = {
    title: '',
    author: '',
    file: null,
  };
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.value.file = target.files[0];
  }
};

const collectionId = '615f4b3b7b3b3b001f3e3b3b';
const authToken = localStorage.getItem('authToken');
const runtimeConfig = useRuntimeConfig();
const backBaseUrl = runtimeConfig.public.API_BASE_URL;

const API_URL_ITEMS = `${backBaseUrl}/submit/${collectionId}`;
const addItem = async () => {
  authToken
    console.log('Verificando estatus...');
    try {
        const response = await axios.post(`${API_URL_ITEMS}`, {
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': localStorage.getItem('authToken'),
            'X-XSRF-TOKEN': localStorage.getItem('csrfToken'),
        },
        withCredentials: true,
        });
        console.log(response.data);
    } catch (err) {
        console.error('Error alcrear el item:', err);
    } finally {
    }
};


const items = ref({}); 
const existenItems = ref(false);

const API_URL_ITEMS_GET = `${backBaseUrl}/core/items/e6a6edf9-04f4-4276-b8b7-5c7b2c78207f`;
const getItems = async () => {
    console.log('Obteniendo items...');
    try {
        const response = await axios.get(`${API_URL_ITEMS_GET}`,{
        headers: { 
            'Accept': 'application/json, text/plain, */*',
            'Authorization': localStorage.getItem('authToken')
        },
        withCredentials: true,
        });
        console.log(response.data);
        items.value = response.data;
        existenItems.value = true;
    } catch (err) {
        console.error('Error al obtener items', err);
    }
};

const submitForm = () => {
  if (form.value.title && form.value.author && form.value.file) {
    addItem();
    emit('submit-item', { ...form.value });
    resetForm();
    
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
}

label {
  margin-top: 10px;
}

button {
  margin-top: 15px;
}

.error {
  color: red;
}
</style>
