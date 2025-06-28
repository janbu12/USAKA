package com.PKM.usaka.data.auth.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class LoginResponse(
    @Json(name = "message") val message: String,
    @Json(name = "uid") val uid: String,
    @Json(name = "email") val email: String,
    @Json(name = "username") val username: String,
    @Json(name = "customToken") val customToken: String
)