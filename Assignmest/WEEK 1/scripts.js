document.addEventListener('DOMContentLoaded', function () {
    fetchProjects();
    fetchLeetCodeData('mohdkashan21165');
    handleScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);
});

function fetchProjects() {
    const projectsContainer = document.querySelector('.projects-container');

    fetch('https://api.github.com/users/kashan16/repos')
        .then(response => response.json())
        .then(data => {
            const filteredRepos = data.filter(repo => repo.description && repo.description.includes('portfolio'));

            filteredRepos.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                `;
                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error fetching GitHub repositories:', error));
}

function fetchLeetCodeData(username) {
    fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`)
        .then(response => response.json())
        .then(data => {
            const leetcodeData = {
                totalSolved: data.totalSolved,
                categories: {
                    Easy: data.easySolved,
                    Medium: data.mediumSolved,
                    Hard: data.hardSolved
                }
            };

            document.getElementById('leetcode-total').textContent = leetcodeData.totalSolved;

            const ctx = document.getElementById('leetcode-chart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(leetcodeData.categories),
                    datasets: [{
                        data: Object.values(leetcodeData.categories),
                        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
                        borderColor: '#0a192f',
                        borderWidth: 3,
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#ccd6f6',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching LeetCode data:', error));
}

function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
}

function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const threshold = 75;
    sections.forEach(section => {
        // Exclude the LeetCode section
        if (section.id !== 'leetcode') {
            if (isInViewport(section, threshold)) {
                section.classList.add('visible');
                section.classList.remove('hidden');
            } else {
                section.classList.remove('visible');
                section.classList.add('hidden');
            }
        } else {
            // Always make LeetCode section visible
            section.classList.add('visible');
            section.classList.remove('hidden');
        }
    });
}
