package com.PKM.usaka.features.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.PKM.usaka.data.auth.AuthRepository
import kotlinx.coroutines.launch

class LoginViewModel(
    private val authRepository: AuthRepository = AuthRepository() // Inisialisasi Repository
) : ViewModel() {

    // State untuk input
    var email by mutableStateOf("")
    var password by mutableStateOf("")

    // State untuk UI (loading, error, success)
    var isLoading by mutableStateOf(false)
        private set // Hanya bisa di-set dari dalam ViewModel

    var errorMessage by mutableStateOf<String?>(null)
        private set

    var loginSuccess by mutableStateOf(false)
        private set

    // Fungsi untuk memicu proses login
    fun login() {
        isLoading = true
        errorMessage = null
        loginSuccess = false

        viewModelScope.launch {
            try {
                // Langkah 1: Login ke API Anda
                val apiResult = authRepository.loginApi(email, password)

                apiResult.onSuccess { response ->
                    val customToken = response.customToken
                    // Langkah 2: Login ke Firebase dengan custom token
                    val firebaseResult = authRepository.firebaseLoginWithCustomToken(customToken)

                    firebaseResult.onSuccess {
                        loginSuccess = true // Set state sukses
                    }.onFailure { e ->
                        errorMessage = "Firebase login failed: ${e.message}"
                        loginSuccess = false
                    }
                }.onFailure { e ->
                    errorMessage = "API login failed: ${e.message}"
                    loginSuccess = false
                }
            } catch (e: Exception) {
                errorMessage = "An unexpected error occurred: ${e.message}"
                loginSuccess = false
            } finally {
                isLoading = false // Pastikan loading dinonaktifkan
            }
        }
    }

    // Fungsi untuk mereset state error atau sukses
    fun clearMessages() {
        errorMessage = null
        loginSuccess = false
    }
}