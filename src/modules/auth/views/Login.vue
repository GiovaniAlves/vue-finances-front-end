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
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isLoading"
              indeterminate
              color="white"
              width="3">
            </v-progress-circular>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="person"
                name="name"
                label="Nome"
                type="text"
                v-model.trim="$v.user.name.$model"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid"
              ></v-text-field>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="Email"
                type="email"
                v-model.trim="$v.user.email.$model"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model.trim="$v.user.password.$model"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
              ></v-text-field>
            </v-form>
            <v-btn block depressed @click="isLogin = !isLogin">
              {{ texts.button }}
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              large
              :disabled="$v.$invalid"
              @click="submit">
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { email, minLength, required } from 'vuelidate/lib/validators'
import AuthService from './../services/auth-service'

export default {
  name: 'Login',
  data () {
    return {
      isLogin: true,
      isLoading: false,
      user: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  validations () {
    const validations = {
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
    }

    if (this.isLogin) {
      return validations
    }

    return {
      user: {
        ...validations.user,
        name: {
          required,
          minLength: minLength(3)
        }
      }
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      const name = this.$v.user.name
      if (!name.$dirty) {
        return errors
      }
      !name.required && errors.push('Esse campo é obrigatório')
      !name.minLength && errors.push(`Insira no mínimo ${name.$params.minLength.min} caracteres`)
      return errors
    },
    emailErrors () {
      const errors = []
      const email = this.$v.user.email
      if (!email.$dirty) {
        return errors
      }
      !email.email && errors.push('Insira um e-mail válido')
      !email.required && errors.push('Esse campo é obrigatório')
      return errors
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.user.password
      if (!password.$dirty) {
        return errors
      }
      !password.required && errors.push('Esse campo é obrigatório')
      !password.minLength && errors.push(`Insira no mínimo ${password.$params.minLength.min} caracteres`)
      return errors
    },
    texts () {
      return this.isLogin
        ? {
          toolbar: 'Login',
          button: 'Criar Conta'
        }
        : {
          toolbar: 'Criar Conta',
          button: 'Já possui uma conta'
        }
    }
  },
  methods: {
    async submit () {
      this.isLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 3000))
        const authData = this.isLogin
          ? await AuthService.login(this.user)
          : await AuthService.signup(this.user)
        console.log('AuthData: ', authData)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
