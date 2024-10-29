<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
            </div>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email:</label>
                  <input
                    type="email"
                    v-model="email"
                    id="email"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password:</label>
                  <input
                    type="password"
                    v-model="password"
                    id="password"
                    class="form-control"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <p v-if="error" class="text-danger mt-3">{{ error }}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div style="align-items: center;">
      <button @click="verStatus" class="btn btn-secondary mt-3">Status</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { v4 as uuidv4 } from 'uuid';
  
  //HOST:localhost PORT:4000 npm run dev

  const email = ref('');
  const password = ref('');
  const error = ref<string | null>(null);

  const runtimeConfig = useRuntimeConfig();
  const backBaseUrl = runtimeConfig.public.API_BASE_URL;
  const API_URL_LOGIN = `${backBaseUrl}/authn/login`;
  

  const login = async () => {
      console.log('Iniciando sesión...');
      console.log('RUTA', API_URL_LOGIN);
  
      try {
          // Generar token CSRF random
          const csrfToken = uuidv4();
          document.cookie = `DSPACE-XSRF-COOKIE=${csrfToken}; path=/`;
  
          // Generar un ID de correlación único para la solicitud
          const correlationId = uuidv4();
  
          const params = new URLSearchParams();
          params.append('user', email.value);
          params.append('password', password.value);

          const response = await axios.post(`${API_URL_LOGIN}`, params, {
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Accept-Language': 'es;q=1,es-CL;q=0.1,en-US;q=0.08,en;q=0.07',
                  'Connection': 'keep-alive',
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'X-CORRELATION-ID': correlationId,
                  'X-REFERRER': '/home',
                  'X-XSRF-TOKEN': csrfToken,
              },
              withCredentials: false, 
          });
  
          if (response.headers.authorization) {
              document.cookie = `TOKENITEM=${response.headers.authorization}; path=/`;
          } else {
              throw new Error('Falta el token de autenticación');
          }
      } catch (err) {
          error.value = (err as Error).message;
          console.error('Error:', err);
      }
  };
  
  // Verificar el estado de autenticación
  const API_URL_STATUS = `${backBaseUrl}/authn/status`;
  const verStatus = async () => {
      console.log('Verificando estatus...');
      console.log('RUTA', API_URL_STATUS);
  
      try {
          const response = await axios.get(`${API_URL_STATUS}`, {
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'X-CORRELATION-ID': uuidv4(),
              },
              withCredentials: true,
          });
          console.log(response.data);
      } catch (err) {
          console.error('Error al verificar el estado:', err);
      }
  };
  </script>
  
  
<style scoped>
    form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
    }

    label {
    margin-top: 10px;
    }

    button {
    margin-top: 15px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    }

    button:hover {
    background-color: #0056b3;
    }

    .error {
    color: red;
    }
</style>