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
    const userRole = document.getElementById('user-role').value;

    try {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userRole}),
        });

        if (response.ok) {
            if (userRole === 'faculty') {
                window.location.href = '/faculty/dashboard';
            } else if (userRole === 'student') {
                window.location.href = '/student/dashboard';
            } else if (userRole === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                alert('Unknown user role');
            }
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});