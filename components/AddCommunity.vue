<template>
    <div class="container mt-5">
      <div class="text-center mb-5"> 
        <h4><strong>AGREGAR COMUNIDAD</strong></h4>
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
        <button type="button" class="btn btn-dark" @click="getCommunitys">Obtener comunidades</button>
      </div>
      <div v-if="existenComunidades" >
          <h3>COMUNIDADES</h3>
          <ul>
              <li v-for="community in communities">
                  NAME: {{ community.name }} - ID: {{ community.uuid }}
              </li>
          </ul>
      </div>
      auth: {{ authToken }} xsrf: {{ xsrfToken }}
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import axios from 'axios';

  interface FormDataCommunity {
    name: string;
  }
  
  const form = ref<FormDataCommunity>({
    name: '',
  });
  
  const emit = defineEmits<{ (e: 'submit-comm', data: FormDataCommunity): void }>();
  
  const resetForm = () => {
    form.value = {
     name: '',
    };
  };
  const authToken = localStorage.getItem('authToken');
  const xsrfToken = localStorage.getItem('xsrfToken');

  const runtimeConfig = useRuntimeConfig();
  const backBaseUrl = runtimeConfig.public.API_BASE_URL;

  /**
   * {"type":{"value":"community"},"metadata":{"dc.title":[{"language":null,"value":"Prueba comunity"}],"dc.description":[{"language":null}],"dc.description.abstract":[{"language":null}],"dc.rights":[{"language":null}],"dc.description.tableofcontents":[{"language":null}]}},
   */
  
  const API_URL_COMMUNITY = `${backBaseUrl}/submit/community`;
  const addCommunity = async () => {
      console.log('Creando comunidad...');
      const requestBody = {
          type: { value: 'community' },
          metadata: {
              'dc.title': [{ language: null, value: form.value.name }],
              'dc.description': [{ language: null }],
              'dc.description.abstract': [{ language: null }],
              'dc.rights': [{ language: null }],
              'dc.description.tableofcontents': [{ language: null }],
          },
      };
      try {
          const response = await axios.post(API_URL_COMMUNITY, requestBody, {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json, text/plain, */*',
                  'Authorization': authToken,
                  'DSPACE-XSRF-COOKIE': xsrfToken,
                  'XSRF-TOKEN': xsrfToken,
              },
              withCredentials: true,
          });
          console.log(response.data);
      } catch (err) {
          console.error('Error al crear comunidad', err);
      }
  };

  

  const communities = ref({}); 
  const existenComunidades = ref(false);

  const API_URL_COMMUNITY_GET = `${backBaseUrl}/core/communities`;
  const getCommunitys = async () => {
      console.log('Obteniendo comunidades...');
      try {
          const response = await axios.get(`${API_URL_COMMUNITY_GET}`,{
          headers: { 
              'Accept': 'application/json, text/plain, */*',
              'Authorization': localStorage.getItem('authToken')
          },
          withCredentials: true,
          });
          console.log(response.data._embedded.communities);
          communities.value = response.data._embedded.communities;
          existenComunidades.value = true;
      } catch (err) {
          console.error('Error al obtener comunidades', err);
      }
  };


  const submitForm = () => {
    if (form.value.name) {
      addCommunity();
      emit('submit-comm', { ...form.value });
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
  