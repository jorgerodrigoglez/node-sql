const moment = require('moment');

const isDate = ( value ) => {
    //console.log(value);

    if(!value){
        return false;
    }

    const date = moment(value);
    
    if( date.isValid() ){
        return true;
    }else{
        return false;
    }
}

module.exports = { isDate }