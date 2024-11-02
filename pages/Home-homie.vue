<template>
    <div class="container mt-5">
      <AddItem @submit-item="handleSubmit" />
    </div>
  </template>
  
  <script setup lang="ts">
  import AddItem from '~/components/AddItem.vue';
  
  const handleSubmit = () => {
    console.log('GO FORM');
    
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
  