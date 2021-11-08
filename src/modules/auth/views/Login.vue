<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex
        xs12
        sm6
        md5
        lg4
        xl3
      >
        <v-card class="elevation-24">

          <v-toolbar color="primary" dark>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-text-field
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
                prepend-icon="email"
                name="email"
                label="Email"
                type="email"
                v-model.trim="$v.user.email.$model"
              ></v-text-field>
              <v-text-field
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model.trim="$v.user.password.$model"
              ></v-text-field>
            </v-form>
            <v-btn block depressed>
              Criar Conta
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              large
              :disabled="$v.$invalid"
              @click="submit">
              Login
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { email, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      const email = this.$v.user.email
      if (!email.$dirty) { return errors }
      !email.email && errors.push('Insira um e-mail válido')
      !email.required && errors.push('Esse campo é obrigatório')
      return errors
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.user.password
      if (!password.$dirty) { return errors }
      !password.required && errors.push('Esse campo é obrigatório')
      !password.minLength && errors.push(`Insira no mínimo ${password.$params.minLength.min} caracteres`)
      return errors
    }
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    submit () {
      console.log('Vuelidade: ', this.$v)
    }
  }
}
</script>
