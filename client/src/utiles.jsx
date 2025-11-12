export function formatDate(date){
    var dateObj = new Date(date);
    var year = dateObj.getFullYear();
    var month = dateObj.toLocaleString('default', {month: 'short'});
    return month + ' ' + year;
}