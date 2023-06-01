$(document).ready(function(){
    //Parallax
    $('.parallaxie').parallaxie({
        speed: 0.5
    });

    //Botones hover
    /*let buttons = $('button, .btn-secundario, .btn-primario').toArray();
    buttons.forEach(element => {
        $(element).mouseenter(function(){
            $(element).css('background-color', $(element).css('background-color').replace(')', ', 0.5)').replace('rgb', 'rgba'));

        })
        $(element).mouseleave(function(){
            $(element).css('background-color', $(element).css('background-color').replace(', 0.5)', ')').replace('rgba', 'rgba'));
        });
    });*/

    //Al pulsar un botón (en función de su clase)
    $(document).on('click', '.vinotecas', function(){
  
        window.location.href = "finder.html?categoria=8";
    })

    $(document).on('click', '.billares', function(){
  
        window.location.href = "finder.html?categoria=9";
    })

    $(document).on('click', '.cafes', function(){
  
        window.location.href = "finder.html?categoria=6";
    })

    $(document).on('click', '.japo', function(){
  
        window.location.href = "finder.html?tipo=2";
    })

})