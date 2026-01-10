import React, { useState } from 'react';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        serviceType: '',
        budget: '',
        timeline: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const serviceTypes = [
        'Web Development',
        'Mobile App Development',
        'E-commerce Solution',
        'UI/UX Design',
        'Digital Marketing',
        'Consulting',
        'Other'
    ];

    const budgetRanges = [
        'Dưới 10 triệu',
        '10-50 triệu',
        '50-100 triệu',
        '100-500 triệu',
        'Trên 500 triệu'
    ];

    const timelineOptions = [
        'Ngay lập tức',
        '1-2 tuần',
        '1 tháng',
        '2-3 tháng',
        '3-6 tháng',
        'Linh hoạt'
    ];

    const contactInfo = [
        {
            icon: '📍',
            title: 'Địa chỉ',
            info: ['123 Nguyễn Văn Linh, Quận 7', 'TP.HCM, Việt Nam']
        },
        {
            icon: '📞',
            title: 'Điện thoại',
            info: ['+84 123 456 789', '+84 987 654 321']
        },
        {
            icon: '✉️',
            title: 'Email',
            info: ['hello@company.com', 'support@company.com']
        },
        {
            icon: '🕒',
            title: 'Giờ làm việc',
            info: ['Thứ 2 - Thứ 6: 8:00 - 18:00', 'Thứ 7: 8:00 - 12:00']
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Vui lòng nhập chủ đề';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Tin nhắn phải có ít nhất 10 ký tự';
        }

        if (!formData.serviceType) {
            newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: '',
                serviceType: '',
                budget: '',
                timeline: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="contact-page">
                <div className="container">
                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h2>Cảm ơn bạn đã liên hệ!</h2>
                        <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 24 giờ.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setSubmitSuccess(false)}
                        >
                            Gửi tin nhắn khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-page">
            {/* Contact Hero */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Liên hệ với chúng tôi</h1>
                    <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-section">
                            <h2>Gửi tin nhắn cho chúng tôi</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Họ và tên *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={errors.name ? 'error' : ''}
                                            placeholder="Nhập họ và tên"
                                        />
                                        {errors.name && <span className="error-message">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={errors.email ? 'error' : ''}
                                            placeholder="Nhập email"
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={errors.phone ? 'error' : ''}
                                            placeholder="Nhập số điện thoại"
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="company">Công ty</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên công ty"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="serviceType">Loại dịch vụ quan tâm *</label>
                                    <select
                                        id="serviceType"
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        className={errors.serviceType ? 'error' : ''}
                                    >
                                        <option value="">Chọn loại dịch vụ</option>
                                        {serviceTypes.map((service, index) => (
                                            <option key={index} value={service}>
                                                {service}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="budget">Ngân sách dự kiến</label>
                                        <select
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn ngân sách</option>
                                            {budgetRanges.map((budget, index) => (
                                                <option key={index} value={budget}>
                                                    {budget}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="timeline">Thời gian thực hiện</label>
                                        <select
                                            id="timeline"
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn thời gian</option>
                                            {timelineOptions.map((timeline, index) => (
                                                <option key={index} value={timeline}>
                                                    {timeline}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Chủ đề *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className={errors.subject ? 'error' : ''}
                                        placeholder="Nhập chủ đề"
                                    />
                                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Nội dung tin nhắn *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className={errors.message ? 'error' : ''}
                                        placeholder="Mô tả chi tiết về dự án hoặc yêu cầu của bạn..."
                                    ></textarea>
                                    {errors.message && <span className="error-message">{errors.message}</span>}
                                    <div className="char-count">
                                        {formData.message.length}/1000 ký tự
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-large"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '🔄 Đang gửi...' : '📤 Gửi tin nhắn'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info-section">
                            <h2>Thông tin liên hệ</h2>
                            <div className="contact-info-list">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="contact-info-item">
                                        <div className="contact-icon">{item.icon}</div>
                                        <div className="contact-details">
                                            <h4>{item.title}</h4>
                                            {item.info.map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="social-media">
                                <h4>Theo dõi chúng tôi</h4>
                                <div className="social-links">
                                    <a href="#" className="social-link facebook">📘 Facebook</a>
                                    <a href="#" className="social-link twitter">🐦 Twitter</a>
                                    <a href="#" className="social-link linkedin">💼 LinkedIn</a>
                                    <a href="#" className="social-link instagram">📷 Instagram</a>
                                </div>
                            </div>

                            <div className="map-section">
                                <h4>Vị trí của chúng tôi</h4>
                                <div className="map-placeholder">
                                    <img
                                        src="https://via.placeholder.com/300x200/E0E0E0/757575?text=Google+Maps"
                                        alt="Map"
                                    />
                                    <p>Nhấn để mở Google Maps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2>Câu hỏi thường gặp</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Thời gian phản hồi là bao lâu?</h4>
                            <p>Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Có tư vấn miễn phí không?</h4>
                            <p>Có, chúng tôi cung cấp buổi tư vấn miễn phí đầu tiên.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Có hỗ trợ sau khi hoàn thành dự án?</h4>
                            <p>Có, chúng tôi cung cấp bảo hành và hỗ trợ kỹ thuật.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Làm thế nào để theo dõi tiến độ dự án?</h4>
                            <p>Chúng tôi sẽ cung cấp báo cáo tiến độ định kỳ và dashboard theo dõi.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContactPage;