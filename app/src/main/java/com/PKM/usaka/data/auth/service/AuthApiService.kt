package com.PKM.usaka.data.auth.service

import com.PKM.usaka.data.auth.model.LoginResponse
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("auth/login")
    suspend fun login(@Body requestBody: RequestBody): Response<LoginResponse>
}