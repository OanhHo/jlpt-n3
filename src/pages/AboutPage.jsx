import React, { useState, useEffect } from 'react';
import { usersApi, statsApi } from '../services';
import LoadingSpinner from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';

function AboutPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch team members (admin và moderator users)
                const [usersResponse, statsResponse] = await Promise.all([
                    usersApi.getUsers({ limit: 10 }),
                    statsApi.getStats()
                ]);

                setTeamMembers(usersResponse.data);
                setStats(statsResponse);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const companyValues = [
        {
            icon: "🎯",
            title: "Tập trung vào chất lượng",
            description: "Chúng tôi luôn đặt chất lượng sản phẩm lên hàng đầu"
        },
        {
            icon: "🤝",
            title: "Hợp tác nhóm",
            description: "Làm việc nhóm hiệu quả, hỗ trợ lẫn nhau"
        },
        {
            icon: "💡",
            title: "Sáng tạo",
            description: "Luôn tìm kiếm các giải pháp sáng tạo và hiệu quả"
        },
        {
            icon: "🚀",
            title: "Phát triển bền vững",
            description: "Xây dựng sản phẩm có thể mở rộng và bền vững"
        }
    ];

    if (loading) {
        return (
            <div className="page-container">
                <LoadingSpinner text="Đang tải thông tin về chúng tôi..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <ErrorMessage
                    error={error}
                    title="Không thể tải thông tin"
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="about-page">
            {/* About Hero */}
            <section className="about-hero">
                <div className="container">
                    <h1>Về chúng tôi</h1>
                    <p className="hero-subtitle">
                        Chúng tôi là đội ngũ passionate developers tạo ra những sản phẩm web hiện đại
                    </p>
                </div>
            </section>

            {/* Company Story */}
            <section className="company-story">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-content">
                            <h2>Câu chuyện của chúng tôi</h2>
                            <p>
                                Bắt đầu từ năm 2020, chúng tôi đã khởi tạo với mục tiêu tạo ra những
                                ứng dụng web chất lượng cao, giúp doanh nghiệp chuyển đổi số hiệu quả.
                            </p>
                            <p>
                                Với kinh nghiệm sâu rộng trong React, Node.js, và các công nghệ hiện đại,
                                chúng tôi đã phục vụ hơn 100 khách hàng trên toàn quốc.
                            </p>
                            <div className="story-stats">
                                <div className="story-stat">
                                    <strong>{stats?.users?.total || 0}</strong>
                                    <span>Thành viên</span>
                                </div>
                                <div className="story-stat">
                                    <strong>{stats?.products?.total || 0}</strong>
                                    <span>Sản phẩm</span>
                                </div>
                                <div className="story-stat">
                                    <strong>{stats?.posts?.total || 0}</strong>
                                    <span>Bài viết</span>
                                </div>
                            </div>
                        </div>
                        <div className="story-image">
                            <img
                                src="https://via.placeholder.com/400x300/673AB7/white?text=Our+Story"
                                alt="Our Story"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Values */}
            <section className="company-values">
                <div className="container">
                    <h2>Giá trị cốt lõi</h2>
                    <div className="values-grid">
                        {companyValues.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <h2>Đội ngũ của chúng tôi</h2>
                    <p className="team-intro">
                        Gặp gỡ những con người tài năng đằng sau thành công của chúng tôi
                    </p>
                    <div className="team-grid">
                        {teamMembers.map(member => (
                            <div key={member.id} className="team-card">
                                <img src={member.avatar} alt={member.name} />
                                <h3>{member.name}</h3>
                                <p className="role">{member.role === 'admin' ? 'Team Lead' : member.role === 'moderator' ? 'Senior Developer' : 'Developer'}</p>
                                <p className="bio">{member.email}</p>
                                <p className="join-date">Tham gia: {member.createdAt}</p>
                                <div className="social-links">
                                    <a href="#" className="social-link">💼</a>
                                    <a href="#" className="social-link">🐙</a>
                                    <a href="#" className="social-link">🐦</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="tech-stack">
                <div className="container">
                    <h2>Công nghệ chúng tôi sử dụng</h2>
                    <div className="tech-categories">
                        <div className="tech-category">
                            <h3>Frontend</h3>
                            <div className="tech-items">
                                <span className="tech-item">React</span>
                                <span className="tech-item">Vue.js</span>
                                <span className="tech-item">TypeScript</span>
                                <span className="tech-item">CSS3</span>
                                <span className="tech-item">Sass</span>
                            </div>
                        </div>
                        <div className="tech-category">
                            <h3>Backend</h3>
                            <div className="tech-items">
                                <span className="tech-item">Node.js</span>
                                <span className="tech-item">Express</span>
                                <span className="tech-item">Python</span>
                                <span className="tech-item">PostgreSQL</span>
                                <span className="tech-item">MongoDB</span>
                            </div>
                        </div>
                        <div className="tech-category">
                            <h3>DevOps</h3>
                            <div className="tech-items">
                                <span className="tech-item">Docker</span>
                                <span className="tech-item">AWS</span>
                                <span className="tech-item">CI/CD</span>
                                <span className="tech-item">Git</span>
                                <span className="tech-item">Linux</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission">
                <div className="container">
                    <div className="mission-content">
                        <h2>Sứ mệnh của chúng tôi</h2>
                        <p>
                            "Tạo ra những sản phẩm công nghệ có ý nghĩa, giúp doanh nghiệp
                            và cá nhân đạt được mục tiêu của họ thông qua các giải pháp web hiện đại."
                        </p>
                        <blockquote>
                            "Công nghệ không chỉ là code, mà là cách chúng ta làm cho cuộc sống tốt đẹp hơn."
                            <cite>- CEO, Founder</cite>
                        </blockquote>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage;