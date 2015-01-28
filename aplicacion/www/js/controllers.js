angular.module('starter.controllers', ['ngCordova'])

.controller('PropuestasCtrl', function($scope,$http) {
    var url = urlService+'/propuestas';
  $http.get(url).
    success(function(data, status, headers, config) {
      $scope.propuestas = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})
.controller('PropuestaDetallesCtrl',function($scope,$http,$stateParams){
    var url = urlService+'/propuesta/id_propuesta/'+$stateParams.id_propuesta;
    $http.get(url).
    success(function(data, status, headers, config) {
      $scope.propuesta = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
    var urlimagen = urlService+'/imagen/Promocion_id_promocion/'+$stateParams.id_propuesta;
    $http.get(urlimagen).
    success(function(data, status, headers, config) {
      $scope.imagen = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})
/*.controller('PromocionesCtrl', function($scope, Promociones) {
  $scope.promociones = Promociones.all();
})*/
.controller('cuentaSwitch', function($scope,authUsers){
    if(authUsers.isLoggedIn())
        $scope.urlCuenta = "cuenta/dashboard"
    else
        $scope.urlCuenta = "cuenta/login"
})
.controller('PromocionesCtrl', function($scope, $http) {
    var url = urlService+'/promociones';
  $http.get(url).
    success(function(data, status, headers, config) {
      $scope.promociones = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
    /*var urlimagenes = urlService+'/imagenes';
    $http.get(urlimagenes).
    success(function(data, status, headers, config) {
      $scope.imagenes = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });*/
})
/*.controller('PromocionDetallesCtrl', function($scope, $stateParams, Promociones) {
  $scope.promociones = Promociones.get($stateParams.id_promocion);
})*/
.controller('PromocionDetallesCtrl',function($scope,$http,$stateParams){
    var url = urlService+'/promocion/id_promocion/'+$stateParams.id_promocion;
    $http.get(url).
    success(function(data, status, headers, config) {
      $scope.promocion = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
    var urlimagen = urlService+'/imagen/Promocion_id_promocion/'+$stateParams.id_promocion;
    $http.get(urlimagen).
    success(function(data, status, headers, config) {
      $scope.imagen = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})


.controller('BuscarCtrl', function($scope,$http) {
    var url = urlService+'/categorias/';
    $http.get(url).
    success(function(data, status, headers, config) {
      $scope.categorias = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})

.controller('BuscarFiltroCtrl',function($scope,$http,$stateParams){
    var url = urlService+'/promocionporcategoria/categoria/'+$stateParams.id_categoria;
    $http.get(url).
    success(function(data, status, headers, config) {
      $scope.promociones = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})
.controller('BuscarFiltroDetallesCtrl',function($scope,$http,$stateParams){
    var url = urlService+'/promocion/id_promocion/'+$stateParams.id_promocion;
    $http.get(url).
    success(function(data, status, headers, config) {
      $scope.promociones = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
})


 
//factoria para loguear y desloguear usuarios en angularjs
.factory("authUsers", function($ionicLoading,$http, $location, mensajesFlash,$ionicViewService){

 
    return {
        //retornamos la función login de la factoria authUsers para loguearnos correctamente
        login : function(user){
            return $http({

                url: 'http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/loginUser/',
                method: "POST",
                 data:{'email':user.email,'password':SHA512(user.password)},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                if(data.respuesta == "success"){
                    //si todo ha ido bien limpiamos los mensajes flash
                    mensajesFlash.clear();
                    //creamos la sesión con el email del usuario
                    window.localStorage.setItem("udp_email",user.email);
                    //cacheSession(user.email);
                    // using the ionicViewService to hide the back button on next view
                    $ionicViewService.nextViewOptions({
                    disableBack: true
                    });
                    //mandamos a la home
                    $location.path("/tab/cuenta/dashboard");
                }else if(data.respuesta == "incomplete_form"){
                    mensajesFlash.show("Debes introducir bien los datos del formulario");
                }else if(data.respuesta == "failed"){
                     $ionicLoading.show({template: 'La usuario o la contraseña son incorrectos.', duration:1000});
                }
            }).error(function(){
                // using the ionicViewService to hide the back button on next view
                $ionicViewService.nextViewOptions({
                disableBack: true
                });
                $location.path("/tab/cuenta/login");
            })
        },
        //función para cerrar la sesión del usuario
        logout : function(){
            /*return $http({
                url : "http://www.fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/login/loginUser"
            }).success(function(){*/
                //eliminamos la sesión de localStorage
                window.localStorage.removeItem("udp_email");
                //eliminamos la sesión de sessionStorage
                window.localStorage.clear();
                //unCacheSession();
                // using the ionicViewService to hide the back button on next view
                $ionicViewService.nextViewOptions({
                disableBack: true
                });
                $location.path("/tab/cuenta/login");
            //});
        },
        //función que comprueba si la sesión userLogin almacenada en localStorage existe
        isLoggedIn : function(){
                if(window.localStorage.getItem("udp_email") === null || window.localStorage.getItem("udp_email") === "undefined")
                {
                    return false;
                }else{
                    return true;
                }
        }
    }
})
 
//controlador home al que le añadimos la función de poder cerrar la sesión y pasamos
//con $scope.email el email con el que ha iniciado sesión para saludarlo, para esto 
//debemos inyectar las factorias sesionesControl y authUsers
.controller("CuentaCtrl", function($scope, authUsers,$location,$ionicViewService){
        if(!authUsers.isLoggedIn()) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/tab/cuenta/login");
    }
    $scope.email = window.localStorage.getItem("udp_email");
    $scope.logout = function(){
        authUsers.logout();
    }
})
.controller("CuentaEditarPWCtrl", function($location,$ionicViewService,$ionicLoading,$scope, authUsers,$http,cambioPWS){
    //$scope.email = window.localStorage.getItem("udp_email");
    var url = urlService+'/user/email/'+window.localStorage.getItem("udp_email");
    $http.get(url).
        success(function(data, status, headers, config) {
        $scope.usuario = data[0];
            //$scope.encriptada = SHA512($scope.usuario.password);
    }).
    error(function(data, status, headers, config) {
      // log error
    });

     $scope.cambioPW = function(oldpassword,newpassword){
        if(SHA512(oldpassword) == $scope.usuario.password){
            cambioPWS.cambioPW(SHA512(newpassword),$scope.usuario);
        }else{
            $ionicLoading.show({template: 'La contraseña antigua es incorrecta.', duration:1000});

        }

    }
})
.controller("CuentaEditarCtrl", function($scope, authUsers,$http,editUsers){
    //$scope.email = window.localStorage.getItem("udp_email");
    var url = urlService+'/user/email/'+window.localStorage.getItem("udp_email");
    $http.get(url).
        success(function(data, status, headers, config) {
        $scope.usuario = data[0];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
     $scope.editUser = function(user){
        editUsers.editUser(user);
    }
})
.controller("CuentaAnadirCtrl", function($scope, authUsers,$http,anadirPromociones,$cordovaCamera,$ionicLoading,$cordovaFile){
    $scope.email = window.localStorage.getItem("udp_email");
    var url = urlService+'/categorias';
    $http.get(url).
        success(function(data, status, headers, config) {
        $scope.categorias = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });

     $scope.anadirPromocion = function(promocion){
        uploadPicture();
        anadirPromociones.anadirPromocion(promocion);
    }
    $scope.data = { "ImageURI" :  "Select Image" };
    $scope.takePicture = function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.CAMERA
      };
      $cordovaCamera.getPicture(options).then(
        function(imageData) {
            $scope.picData = imageData;
            $scope.ftLoad = true;
            $localstorage.set('fotoUp', imageData);
            $ionicLoading.show({template: 'Foto adquirida...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Error de carga...', duration:500});
            })
      }

      $scope.selectPicture = function() { 
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

      $cordovaCamera.getPicture(options).then(
        function(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                $scope.picData = fileEntry.nativeURL;
                $scope.ftLoad = true;
                $scope.imgURI = "data:image/jpeg;base64," + imageURI;
                var image = document.getElementById('myImage');
                image.src = fileEntry.nativeURL;
            });
            $ionicLoading.show({template: 'Foto adquirida...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Error de carga...', duration:500});
        })
    };

    $scope.uploadPicture = function(promocion) {
        
        var fileURL = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = true;

        var params = {};
        params.producto = promocion.producto;
        params.precio = promocion.precio;
        params.descripcion = promocion.descripcion;
        params.medida = promocion.medida;
        params.compra_minima = promocion.compra_minima;
        params.observacion = promocion.observacion;
        params.categoria = promocion.categoria;
        params.lugar = promocion.lugar;
        params.usuario_email = window.localStorage.getItem("udp_email");
        params.tipo_envio = promocion.tipo_envio;

        options.params = params;

        var ft = new FileTransfer();
        $ionicLoading.show({template: 'Se esta subiendo la foto...',showDelay: 100});
        ft.upload(fileURL, encodeURI("http://www.fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/uploadPhotoo"), win, function(error) {$ionicLoading.show({template: 'Error de conexión...'});
        }, options);

        function win(r) {
            $ionicLoading.hide();
            $ionicLoading.show({template: 'BENE...'});
        }
    }

    var viewUploadedPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }

    $scope.viewPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }
})
.controller("CuentaAnadirPropuestaCtrl", function($scope, authUsers,$http,anadirPromociones,$cordovaCamera,$ionicLoading){
    //$scope.email = window.localStorage.getItem("udp_email");
    var url = urlService+'/categorias';
    $http.get(url).
        success(function(data, status, headers, config) {
        $scope.categorias = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });

     $scope.anadirPropuesta = function(propuesta){
        anadirPropuesta.anadirPropuesta(propuesta);
        uploadPicture();
    }
    $scope.data = { "ImageURI" :  "Select Image" };
    $scope.takePicture = function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.CAMERA
      };
      $cordovaCamera.getPicture(options).then(
        function(imageData) {
            $scope.picData = imageData;
            $scope.ftLoad = true;
            $localstorage.set('fotoUp', imageData);
            $ionicLoading.show({template: 'Foto adquirida...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Error de carga...', duration:500});
            })
      }

      $scope.selectPicture = function() { 
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

      $cordovaCamera.getPicture(options).then(
        function(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                $scope.picData = fileEntry.nativeURL;
                $scope.ftLoad = true;
                $scope.imgURI = "data:image/jpeg;base64," + imageURI;
                var image = document.getElementById('myImage');
                image.src = fileEntry.nativeURL;
            });
            $ionicLoading.show({template: 'Foto adquirida...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Error de carga...', duration:500});
        })
    };

    $scope.uploadPicture = function() {
        $ionicLoading.show({template: 'Se esta subiendo la foto...'});
        var fileURL = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = true;

        var params = {};
        params.value1 = "someparams";
        params.value2 = "otherparams";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://www.fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/uploadPhoto"), function(error) {$ionicLoading.show({template: 'Error de conexión...'});
        $ionicLoading.hide();}, options);
    }

    var viewUploadedPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }

    $scope.viewPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }
})
 //controlador loginController
//inyectamos la factoria authUsers en el controlador loginController
//para hacer el login de los usuarios
.controller("loginController", function($scope, $location, authUsers,$ionicViewService){
    if(authUsers.isLoggedIn()) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/tab/cuenta/dashboard");
    }
    $scope.user = { email : "", password : "" }
    authUsers.flash = "";
   
    //función que llamamos al hacer sumbit al formulario
    $scope.login = function(){
        authUsers.login($scope.user);
    }

})
//controlador registerController
//en nuestro controlador inyectamos registerUsers para poder utilizar 
//la función newRegister pasando los datos del formulario con $scope.user
.controller("registerController", function($scope, registerUsers){
    $scope.registerUser = function(user){
        registerUsers.newRegister(user);
    }
})
//mientras corre la aplicación, comprobamos si el usuario tiene acceso a la ruta a la que está accediendo
//como vemos inyectamos authUsers
.run(function($rootScope, $location, authUsers){
    //creamos un array con las rutas que queremos controlar
    var rutasPrivadas = ["/tab/cuenta/dashboard","/tab/cuenta/editar","/tab/cuenta/anadir"];
    //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function(){
        //si en el array rutasPrivadas existe $location.path(), locationPath en el login
        //es /login, en la home /home etc, o el usuario no ha iniciado sesión, lo volvemos 
        //a dejar en el formulario de login
        if(in_array($location.path(),rutasPrivadas) && !authUsers.isLoggedIn()){
            // using the ionicViewService to hide the back button on next view
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
        disableBack: true
        });
            $location.path("/tab/cuenta/login");
        }

        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
        if(($location.path() === "/tab/cuenta/login") && authUsers.isLoggedIn()){
            // using the ionicViewService to hide the back button on next view
            $ionicViewService.nextViewOptions({
                disableAnimate: true,
            disableBack: true
            });
            $location.path("/tab/cuenta/dashboard");
        }
            if(($location.path() === "/tab/cuenta/dashboard") && !authUsers.isLoggedIn()){
            // using the ionicViewService to hide the back button on next view
            $ionicViewService.nextViewOptions({
                disableAnimate: true,
            disableBack: true
            });
            $location.path("/tab/cuenta/login");
        }
    })
})
 
 
//esto simplemente es para lanzar un mensaje si el login falla, se puede extender para darle más uso
.factory("mensajesFlash", function($rootScope){
    return {
        show_success : function(message){
            $rootScope.flash_success = message;
        },
        show_error : function(message){
            $rootScope.flash_error = message;
        },
        clear : function(){
            $rootScope.flash_success = "";
            $rootScope.flash_error = "";
        }
    }
})
 /*esto simplemente es para lanzar un mensaje si el login falla, se puede extender para darle más uso
.factory("mensajesFlash", function($rootScope){
    return {
        show : function(message){
            $rootScope.flash = message;
        },
        clear : function(){
            $rootScope.flash = "";
        }
    }
})*/
.factory("anadirPromociones",function($http,mensajesFlash,authUsers,$ionicViewService,$location){
    return{
            anadirPromocion : function (promocion) {
                //$scope.email = window.localStorage.getItem("udp_email");
            return $http({
                url: 'http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/promociones/',
                method: "POST",
                 data:{
                    'producto':promocion.producto,
                    'precio':promocion.precio,
                    'descripcion':promocion.descripcion,
                    'medida':promocion.medida,
                    'compra_minima':promocion.compra_minima,
                    'observacion':promocion.observacion,
                    'categoria':promocion.categoria,
                    'lugar':promocion.lugar,
                    'usuario_email':window.localStorage.getItem("udp_email"),
                    'tipo_envio':promocion.tipo_envio
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                $ionicViewService.nextViewOptions({
                    disableBack: true
                    });
                    //mandamos a la home
                    $location.path("/tab/cuenta/dashboard");
            }).error(function(){
                mensajesFlash.show("Error critico");
                // using the ionicViewService to hide the back button on next view
                $ionicViewService.nextViewOptions({
                disableBack: true
                });
                $location.path("/tab/cuenta/anadir");
            })
    }

    }
})
.factory("cambioPWS",function($ionicLoading,$http,mensajesFlash,authUsers,$ionicViewService,$location){
    return{
            cambioPW : function (newpasswordencrypted,usuario) {
            return $http({
                url: 'http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/cambioPW/',
                method: "POST",
                 data:{
                    'email':usuario.email,
                    'password':newpasswordencrypted
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                    $ionicViewService.nextViewOptions({
                    disableBack: true
                    });
                    //mandamos a la home
                    $ionicLoading.show({template: 'Contraseña cambiada correctamente.', duration:1000});
                    $location.path("/tab/cuenta/dashboard");
            }).error(function(){
                $ionicLoading.show({template: 'Se ha producido un error.', duration:1000});
                // using the ionicViewService to hide the back button on next view
                $ionicViewService.nextViewOptions({
                disableBack: true
                });
                $location.path("/tab/cuenta/dashboard");
            })
    }

    }
})

.factory("editUsers",function($http,mensajesFlash,authUsers,$ionicViewService,$location){
    return{
            editUser : function (user) {
            return $http({
                url: 'http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/updateUser/',
                method: "POST",
                 data:{
                    'email':user.email,
                    'nick':user.nick,
                    'direccion':user.direccion,
                    'telefono1':user.telefono1,
                    'telefono2':user.telefono2,
                    'pais':user.pais,
                    'provincia':user.provincia,
                    'poblacion':user.poblacion,
                    'nombre':user.nombre,
                    'apellidos':user.apellidos,
                    'cod_postal':user.cod_postal,
                    'website':user.website
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                $ionicViewService.nextViewOptions({
                    disableBack: true
                    });
                    //mandamos a la home
                    $location.path("/tab/cuenta/dashboard");
            }).error(function(){
                mensajesFlash.show("Error critico");
                // using the ionicViewService to hide the back button on next view
                $ionicViewService.nextViewOptions({
                disableBack: true
                });
                $location.path("/tab/cuenta/dashboard");
            })
    }

    }
})
//factoria para registrar usuarios a la que le inyectamos la otra factoria
//mensajesFlash para poder hacer uso de sus funciones
.factory("registerUsers", function($http, mensajesFlash,authUsers){
    return {
        newRegister : function(user){
        		//var Data = { user: user };
        		
            return $http({
                url: 'http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/registroUsuario/',
                method: "POST",
                //data : "email="+user.email+"&password="+"3"+"&nombre="+"3",
               //dataType: 'json',
                data:{ 'nombre':user.nombre,'email':user.email,'password':SHA512(user.password)},
                //data:{email: user.email},
                //headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'}
            })
             //return $http.post('http://fupudev.com/comprasengrupo/ComprasEnGrupo/admin/index.php/api/example/registroUsuario/',{ user:user } )
             .success(function(data){
                    if(data.respuesta == "success"){
                        mensajesFlash.clear();
                        mensajesFlash.show_success("El registro se ha procesado correctamente.");
                        //creamos la sesión con el email del usuario
                        //cacheSession(user.email);
                            //función que llamamos al hacer sumbit al formulario
                            
                            authUsers.login(user);
                             

                        // using the ionicViewService to hide the back button on next view
                        $ionicViewService.nextViewOptions({
                            disableBack: true
                        });
                        //mandamos a la home
                    $location.path("/tab/cuenta/dashboard");
                    }else if(data.respuesta == "exists"){
                        mensajesFlash.clear();
                        mensajesFlash.show_error("El email introducido ya existe en la bd.");
                    }else if(data.respuesta == "failed"){
                        mensajesFlash.show_error("Ha ocurrido algún error al realizar el roro!.");
                    }else if(data.respuesta == "error_form"){
                    	mensajesFlash.clear();
                        mensajesFlash.show_error("Ha ocurrido algún error al realizar el registro!OUT.");
                    }
                }).error(function(){
                    mensajesFlash.show_error("Ha ocurrido algún error al realizar el registro ERROR MAXIMO!.");
                })
        }
    }
})
//función in_array que usamos para comprobar si el usuario
//tiene permisos para estar en la ruta actual
function in_array(needle, haystack, argStrict){
  var key = '',
  strict = !! argStrict;
 
  if(strict){
    for(key in haystack){
      if(haystack[key] === needle){
        return true;
      }
    }
  }else{
    for(key in haystack){
      if(haystack[key] == needle){
        return true;
      }
    }
  }
  return false;
};