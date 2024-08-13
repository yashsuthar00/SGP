// document.getElementById('signup-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('signup-username').value;
//     const password = document.getElementById('signup-password').value;
    
//         const response = await fetch('/signup', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//         });
    
//         if (response.ok) {
//         alert('User created');
//         } else {
//         alert('Error creating user');
//         }
//     });
    
    document.getElementById('signin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signin-username').value;
        const password = document.getElementById('signin-password').value;
    
        const response = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('User signed in');
    } else {
        alert('Invalid credentials');
    }
});