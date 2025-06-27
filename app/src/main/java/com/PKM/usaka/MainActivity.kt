package com.PKM.usaka

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.PKM.usaka.features.auth.LoginScreen
import com.PKM.usaka.features.auth.RegisterScreen
import com.PKM.usaka.navigation.AppDestionations
import com.PKM.usaka.ui.theme.USAKATheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            USAKATheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    val navController = rememberNavController()

                    NavHost(
                        navController = navController,
                        startDestination = AppDestionations.LOGIN_ROUTE,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(AppDestionations.LOGIN_ROUTE) {
                            LoginScreen(
                                onLoginSuccess = {},
                                onRegisterClick = {
                                    navController.navigate(AppDestionations.REGISTER_ROUTE)
                                }
                            )
                        }

                        composable(AppDestionations.REGISTER_ROUTE) {
                            RegisterScreen(
                                onRegisterSuccess = {},
                                onLoginClick = {
                                    navController.navigate(AppDestionations.LOGIN_ROUTE)
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}