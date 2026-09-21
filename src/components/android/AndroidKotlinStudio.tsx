import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, Layers, Smartphone, Download } from 'lucide-react';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidKotlinStudioProps {
  theme: MaterialTheme;
}

export const AndroidKotlinStudio: React.FC<AndroidKotlinStudioProps> = ({ theme }) => {
  const currentTheme = THEMES[theme];
  const [activeCodeTab, setActiveCodeTab] = useState<'main' | 'muster' | 'camerax' | 'workmanager' | 'manifest'>('main');
  const [copied, setCopied] = useState<boolean>(false);

  const codeSnippets: Record<string, { filename: string; language: string; code: string }> = {
    main: {
      filename: 'MainActivity.kt',
      language: 'kotlin',
      code: `package com.buildforce.workforce

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.buildforce.workforce.ui.theme.BuildForceTheme

/**
 * Modern Android 15 Material You Entry Point
 * BuildForce Construction Workforce & Expense Management
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BuildForceTheme(dynamicColor = true) {
                BuildForceApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BuildForceApp() {
    val navController = rememberNavController()
    var selectedItem by remember { mutableIntStateOf(0) }
    val items = listOf("Home", "Muster", "Scanner", "Wallet", "SiteHub")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("BuildForce Pro • Sector 62 Site", style = MaterialTheme.typography.titleMedium) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceContainer
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceContainer
            ) {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { /* Material 3 Vector Icon */ },
                        label = { Text(item) },
                        selected = selectedItem == index,
                        onClick = { 
                            selectedItem = index
                            navController.navigate(item.lowercase())
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen(onPunch = { /* Biometric GPS */ }) }
            composable("muster") { MusterRollScreen() }
            composable("scanner") { CameraXReceiptScannerScreen() }
            composable("wallet") { WorkerWalletScreen() }
            composable("sitehub") { SiteHubScreen() }
        }
    }
}`,
    },
    muster: {
      filename: 'MusterRollScreen.kt',
      language: 'kotlin',
      code: `package com.buildforce.workforce.ui.screens

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.buildforce.workforce.data.entity.EmployeeEntity

/**
 * Android Material 3 Muster Roll with 1-Tap Attendance & Overtime Slider
 */
@Composable
fun MusterRollScreen(viewModel: AttendanceViewModel = viewModel()) {
    val workers by viewModel.workers.collectAsState()

    LazyColumn(modifier = Modifier.fillMaxSize()) {
        items(workers, key = { it.id }) { worker ->
            ElevatedCard(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
                shape = MaterialTheme.shapes.extraLarge
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(worker.fullName, style = MaterialTheme.typography.titleMedium)
                        AssistChip(
                            onClick = { },
                            label = { Text(worker.skillTrade) }
                        )
                    }
                    
                    // Segmented Attendance Selector (Present / HalfDay / Absent)
                    SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                        SegmentedButton(
                            selected = worker.status == "PRESENT",
                            onClick = { viewModel.markAttendance(worker.id, "PRESENT") },
                            shape = SegmentedButtonDefaults.itemShape(index = 0, count = 3)
                        ) { Text("Present") }
                        SegmentedButton(
                            selected = worker.status == "HALF_DAY",
                            onClick = { viewModel.markAttendance(worker.id, "HALF_DAY") },
                            shape = SegmentedButtonDefaults.itemShape(index = 1, count = 3)
                        ) { Text("Half Day") }
                        SegmentedButton(
                            selected = worker.status == "ABSENT",
                            onClick = { viewModel.markAttendance(worker.id, "ABSENT") },
                            shape = SegmentedButtonDefaults.itemShape(index = 2, count = 3)
                        ) { Text("Absent") }
                    }
                }
            }
        }
    }
}`,
    },
    camerax: {
      filename: 'ReceiptScannerScreen.kt',
      language: 'kotlin',
      code: `package com.buildforce.workforce.camera

import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.runtime.*
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions

/**
 * CameraX Optical Character Recognition (OCR) Engine
 * Automatically extracts Indian Rupee amounts, fuel litres, & vendor names
 */
class ReceiptAnalyzer(
    private val onReceiptDetected: (merchant: String, amount: Double) -> Unit
) : ImageAnalysis.Analyzer {
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    @androidx.camera.core.ExperimentalGetImage
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image ?: return imageProxy.close()
        val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)

        recognizer.process(image)
            .addOnSuccessListener { visionText ->
                // Parse text for ₹ or Total keywords
                val regex = Regex("""(?:Total|INR|Rs\\.?|₹)[\\s:]*([0-9,]+(?:\\.[0-9]{2})?)""")
                regex.find(visionText.text)?.let { match ->
                    val rawAmount = match.groupValues[1].replace(",", "").toDoubleOrNull() ?: 0.0
                    onReceiptDetected("Fuel/Vendor", rawAmount)
                }
            }
            .addOnCompleteListener { imageProxy.close() }
    }
}`,
    },
    workmanager: {
      filename: 'SiteSyncWorker.kt',
      language: 'kotlin',
      code: `package com.buildforce.workforce.sync

import android.content.Context
import androidx.work.*
import com.buildforce.workforce.data.local.AppDatabase
import com.buildforce.workforce.data.remote.BuildForceApiService

/**
 * Android WorkManager Background Offline Synchronization
 * Periodically syncs cached Room attendance & vouchers when connected
 */
class SiteSyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val db = AppDatabase.getInstance(applicationContext)
        val api = BuildForceApiService.create()

        return try {
            // 1. Fetch un-synced vouchers
            val pendingExpenses = db.expenseDao().getUnsyncedExpenses()
            pendingExpenses.forEach { exp ->
                api.submitExpense(exp.toDto())
                db.expenseDao().markAsSynced(exp.id)
            }

            // 2. Fetch un-synced attendance punches
            val pendingAttendance = db.attendanceDao().getUnsyncedAttendance()
            api.batchUploadAttendance(pendingAttendance)
            db.attendanceDao().markAllSynced()

            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}`,
    },
    manifest: {
      filename: 'AndroidManifest.xml',
      language: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.buildforce.workforce">

    <!-- Hardware & Security Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".BuildForceApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BuildForce">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.BuildForce">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
  };

  const currentSnippet = codeSnippets[activeCodeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 pt-3 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <span>Android Studio &amp; Kotlin M3</span>
          </h2>
          <p className="text-[11px] text-slate-400">Jetpack Compose, Room SQLite, CameraX &amp; WorkManager</p>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 active:scale-95 transition-all flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'main', label: 'MainActivity.kt' },
          { key: 'muster', label: 'MusterRollScreen.kt' },
          { key: 'camerax', label: 'ReceiptScanner.kt' },
          { key: 'workmanager', label: 'SiteSyncWorker.kt' },
          { key: 'manifest', label: 'AndroidManifest.xml' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCodeTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
              activeCodeTab === tab.key
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Editor Window */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentSnippet.filename}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {currentSnippet.language}
          </span>
        </div>

        <pre className="p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-96">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
