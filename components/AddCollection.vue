<template>
    <div class="container mt-5">
      <div class="text-center mb-5"> 
        <h4><strong>AGREGAR COLLECCIÓN</strong></h4>
      </div>
      <form @submit.prevent="submitForm">
        
        <div class="mb-3">
          <label for="title" class="form-label">Nombre</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="form.name"
            required
          />
        </div>
  
        <div class="d-flex justify-content-between mb-4">
          <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
      </div>
      <div class="text-center mb-5"> 
        <button type="button" class="btn btn-dark" @click="getCollections">Obtener colecciones</button>
      </div>
      <div v-if="existenColecciones" >
          <h3>COLLECCIONES</h3>
          <ul>
              <li v-for="collection in collections">
                  NAME: {{ collection.name }} - ID: {{ collection.uuid }}
              </li>
          </ul>
      </div>
      auth: {{ authToken }} xsrf: {{ xsrfToken }}
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import axios from 'axios';

  interface FormDataCollection {
    name: string;
  }
  
  const form = ref<FormDataCollection>({
    name: '',
  });
  
  const emit = defineEmits<{ (e: 'submit-coll', data: FormDataCollection): void }>();
  
  const resetForm = () => {
    form.value = {
     name: '',
    };
  };
  const authToken = localStorage.getItem('authToken');
  const xsrfToken = localStorage.getItem('xsrfToken');

  const runtimeConfig = useRuntimeConfig();
  const backBaseUrl = runtimeConfig.public.API_BASE_URL;
  
  const API_URL_COLLECTION = `${backBaseUrl}/submit/collection`;
  const addCollection = async () => {
      console.log('Creando colección...');

      const params = new URLSearchParams();
      //params.append('user', email.value);
      
      try {
          const response = await axios.post(`${API_URL_COLLECTION}`,{
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json, text/plain, */*',
              'Authorization': localStorage.getItem('authToken'),
              'DSPACE-XSRF-COOKIE': localStorage.getItem('xsrfToken'),
              'XSRF-TOKEN': localStorage.getItem('xsrfToken'),
          },
          withCredentials: true,
          });
          console.log(response.data);
      } catch (err) {
          console.error('Error al crear colección', err);
      } finally {
      }
  };
  

  const collections = ref({}); 
  const existenColecciones = ref(false);

  const API_URL_COLLECTIONS_GET = `${backBaseUrl}/core/collections`;
  const getCollections = async () => {
      console.log('Obteniendo colecciones...');
      try {
          const response = await axios.get(`${API_URL_COLLECTIONS_GET}`,{
          headers: { 
              'Accept': 'application/json, text/plain, */*',
              'Authorization': localStorage.getItem('authToken')
          },
          withCredentials: true,
          });
          console.log(response.data._embedded.collections);
          collections.value = response.data._embedded.collections;
          existenColecciones.value = true;
      } catch (err) {
          console.error('Error al obtener colecciones', err);
      }
  };


  const submitForm = () => {
    if (form.value.name) {
      addCollection();
      emit('submit-coll', { ...form.value });
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
  