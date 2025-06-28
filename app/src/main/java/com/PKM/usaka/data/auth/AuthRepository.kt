package com.PKM.usaka.data.auth

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.PKM.usaka.data.auth.model.LoginResponse
import com.PKM.usaka.data.auth.network.RetrofitClient
import kotlinx.coroutines.tasks.await
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class AuthRepository {

    private val authApiService = RetrofitClient.authApiService
    private val firebaseAuth = FirebaseAuth.getInstance()

    // Fungsi untuk login ke API Anda
    suspend fun loginApi(email: String, password: String): Result<LoginResponse> {
        return try {
            val jsonObject = JSONObject().apply {
                put("email", email)
                put("password", password)
            }
            val requestBody = jsonObject.toString().toRequestBody("application/json".toMediaTypeOrNull())

            val response = authApiService.login(requestBody)

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e("AuthRepository", "API Login failed: ${response.code()} - $errorBody")
                Result.failure(Exception("API Login failed: ${response.code()} - $errorBody"))
            }
        } catch (e: Exception) {
            Log.e("AuthRepository", "Exception during API login", e)
            Result.failure(e)
        }
    }

    // Fungsi untuk login ke Firebase menggunakan custom token
    suspend fun firebaseLoginWithCustomToken(customToken: String): Result<Unit> {
        return try {
            firebaseAuth.signInWithCustomToken(customToken).await()
            Log.d("AuthRepository", "Firebase login successful with custom token")
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e("AuthRepository", "Firebase login failed with custom token", e)
            Result.failure(e)
        }
    }

    // Mendapatkan status login Firebase (jika sudah ada user aktif)
    fun getCurrentUser(): String? {
        return firebaseAuth.currentUser?.uid
    }
}