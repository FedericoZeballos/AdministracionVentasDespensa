' Script VBS para ejecutar Control de Ventas sin consola visible
' Autor: Sistema de Control de Ventas
' Versión: 1.0.0

Option Explicit

Dim objShell, objFSO, strPath, strNodePath, strNpmPath
Dim strCommand, intResult

' Crear objetos
Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Obtener la ruta actual
strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Esperar a que el servidor esté disponible
Function WaitForServer(url, timeoutSeconds)
    Dim http, startTime
    startTime = Timer
    Do
        On Error Resume Next
        Set http = CreateObject("MSXML2.XMLHTTP")
        http.Open "GET", url, False
        http.setRequestHeader "Cache-Control", "no-cache"
        http.Send
        If Err.Number = 0 Then
            If http.Status >= 200 And http.Status < 500 Then
                WaitForServer = True
                Exit Function
            End If
        End If
        On Error GoTo 0
        WScript.Sleep 500
    Loop While (Timer - startTime) < timeoutSeconds
    WaitForServer = False
End Function

' Verificar si Node.js está instalado
strNodePath = "node"
intResult = objShell.Run(strNodePath & " --version", 0, True)

If intResult <> 0 Then
    MsgBox "ERROR: Node.js no está instalado." & vbCrLf & _
           "Descarga desde: https://nodejs.org/", vbCritical, "Control de Ventas"
    WScript.Quit 1
End If

' Verificar si existen las dependencias
If Not objFSO.FolderExists(strPath & "\node_modules") Then
    ' Instalar dependencias silenciosamente
    strCommand = "cmd /c cd /d """ & strPath & """ && npm install"
    objShell.Run strCommand, 0, True
End If

' Establecer variable de entorno
objShell.Environment("PROCESS")("NODE_ENV") = "development"

' Iniciar el servidor backend en segundo plano (SQLite + API)
strCommand = "cmd /c cd /d """ & strPath & """ && node src\\js\\server.js"
objShell.Run strCommand, 0, False

' Esperar a que el servidor responda antes de abrir la app
If Not WaitForServer("http://localhost:3000/api/ventas", 15) Then
    MsgBox "ERROR: No se pudo iniciar el servidor backend (puerto 3000)." & vbCrLf & _
           "Revisa que no esté bloqueado por el antivirus/firewall o ya en uso.", vbCritical, "Control de Ventas"
    WScript.Quit 1
End If

' Ejecutar la aplicación Electron
strCommand = "cmd /c cd /d """ & strPath & """ && npm run electron"
objShell.Run strCommand, 0, False

' Limpiar objetos
Set objShell = Nothing
Set objFSO = Nothing
