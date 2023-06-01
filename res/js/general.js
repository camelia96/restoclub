$(document).ready(function(){
    
        

        //Botones  --> hover
        let btns = $('.btn-secundario, .btn-primario ').toArray();
        btns.forEach(element => {
            let backgroundColor =  $(element).css('background-color');
            let textColor = $(element).css('color');
            $(element).css("border", "2px solid " + backgroundColor);
            $(element).mouseenter(function(){
                $(element).css("border", "2px solid " + backgroundColor);
                $(element).css({'background-color': 'transparent', 'color':backgroundColor});
            })
            $(element).mouseleave(function(){
                $(element).css({'background-color': backgroundColor, 'color':textColor});
            })
        });
})