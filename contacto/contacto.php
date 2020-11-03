
<?php
$remitente = "Email" . $_POST["email"];
$destinatario = 'milemonson@gmail.com'; 
$asunto = 'Consulta'; 
if (!$_POST){
?>

<?php
}else{
	 
    $cuerpo = "Nombre:" . $_POST["Nombre"] . "\r\n"; 
    $cuerpo .= "Email:" . $_POST["email"] . "\r\n";
    $cuerpo .= "Telefono:" . $_POST["telefono"] . "\r\n";
	  $cuerpo .= "Asunto:" . $_POST["Asunto"] . "\r\n";
	  $cuerpo .= "Mensaje:" . $_POST["msg"] . "\r\n";
	

    $headers  = "MIME-Version: 1.0\n";
    $headers .= "Content-type: text/plain; charset=utf-8\n";
    $headers .= "X-Priority: 3\n";
    $headers .= "X-MSMail-Priority: Normal\n";
    $headers .= "X-Mailer: php\n";
   
mail($destinatario, $asunto, $cuerpo, $headers);
    
 include 'Confirmacion.html';
}
?>
