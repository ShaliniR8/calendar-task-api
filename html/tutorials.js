function next(event) {
    let input = document.getElementById('curVal');
    document.getElementById(input.value).setAttribute('hidden', true);
    switch (input.value) {
        case 'tut_1':
            input.value = 'tut_2';
            break;
        case 'tut_2':
            input.value = 'tut_3';
            break;
        case 'tut_3':
            input.value = 'tut_4';
            break;
        case 'tut_4':
            input.value = 'tut_5';
            break;
        case 'tut_5':
            input.value = 'tut_6';
            break;
        case 'tut_6':
            input.value = 'tut_6';
            break;
    }
    document.getElementById(input.value).removeAttribute('hidden');
}

function prev(event) {
    let input = document.getElementById('curVal');
    document.getElementById(input.value).setAttribute('hidden', true);
    switch (input.value) {
        case 'tut_1':
            input.value = 'tut_1';
            break;
        case 'tut_2':
            input.value = 'tut_1';
            break;
        case 'tut_3':
            input.value = 'tut_2';
            break;
        case 'tut_4':
            input.value = 'tut_3';
            break;
        case 'tut_5':
            input.value = 'tut_4';
            break;
        case 'tut_6':
            input.value = 'tut_5';
            break;
    }
    document.getElementById(input.value).removeAttribute('hidden');
}
