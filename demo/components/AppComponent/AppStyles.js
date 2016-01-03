let styles = {
    base: {
        margin: '40px'
    },
    contentStyle: function(isOpen) {
        return {
            color: '#292A2A',
            marginTop: '0px',
            padding: '100px',
            background: 'white',
            backgroundImage: 'url(../app/images/prof3.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            boxSizing: 'border-box',
            transform: isOpen ? 'translate3d(0px, 0px, -200px)' : 'translate3d(0px, 0px, 1px)' ,
            transition: 'all 0.4s linear',
            //transform: 'rotate(0deg)',
            transformOrigin: 'center',
            transformStyle: 'preserve-3d'
        };
    },
    salutation: {
        fontSize: '122px',
        marginBottom: '0'
    },
    labels: {
        margin: '0 auto',
        textAlign: 'center'
    },
    presentation: {
        fontSize: '54px',
        fontWeight: '400',
        marginTop: '0'
    }
};

export default styles;
