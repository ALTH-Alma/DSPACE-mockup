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
  </template>
  
  <script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useRouter } from '#vue-router';

    const router = useRouter();
    
    const email = ref('');
    const password = ref('');
    const error = ref<string | null>(null);
    const csrfTokenVerify = ref<string | null>(null);
    const authToken = ref<string | null>(null);
    const authStatus = ref(false);


    const runtimeConfig = useRuntimeConfig();
    const backBaseUrl = runtimeConfig.public.API_BASE_URL;
    
    const getCsrfToken = async () => {
        try {
        const response = await axios.get(`${backBaseUrl}/security/csrf`, {
            headers: {
            'Accept': 'application/json, text/plain, */*',
            },
            withCredentials: true,
        });

        csrfTokenVerify.value = response.headers['dspace-xsrf-token'] || null;
        console.log('Token CSRF obtenido:', csrfTokenVerify.value);
        return csrfTokenVerify.value;
        } catch (err) {
        console.error('Error al verificar el estado:', err);
        return null;
        }
    };
  
    const API_URL_LOGIN = `${backBaseUrl}/authn/login`;
    const login = async () => {
        console.log('Iniciando sesión...');
        try {
            const csrfTokenCookie = await getCsrfToken();
            const params = new URLSearchParams();
            params.append('user', email.value);
            params.append('password', password.value);

            const response = await axios.post(`${API_URL_LOGIN}`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/plain, */*',
                'X-XSRF-TOKEN': csrfTokenCookie,
            },
            withCredentials: true,
            });

            if (response.headers.authorization) {
                console.log('Respuesta:', response.headers);
                authToken.value = response.headers.authorization;
                console.log('Token de autenticación almacenado:', authToken.value);
            } else {
                throw new Error('Falta el token de autenticación');
            }
        } catch (err) {
            error.value = (err as Error).message;
            console.error('Error:', err);
        } finally {
            email.value = '';
            password.value = '';
            verStatus();
        }
    };

    const API_URL_STATUS = `${backBaseUrl}/authn/status`;
    const verStatus = async () => {
        console.log('Verificando estatus...');
        try {
            const response = await axios.get(`${API_URL_STATUS}`, {
            headers: { 
                'Accept': 'application/json, text/plain, */*',
                'Authorization': authToken.value,
            },
            withCredentials: true,
            });
            console.log(response.data);
            authStatus.value = response.data.authenticated;
        } catch (err) {
            console.error('Error al verificar el estado:', err);
            authStatus.value = false;
        } finally {
            goHome();
        }
    };

    const goHome = () => {
        if (authStatus.value) {
            const token = authToken.value ?? "";
            localStorage.setItem('authToken', token);
            router.push('/home-homie');
        } else {
            console.log('No autorizado');
        }
    }

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