import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Field = ({ label, type, placeholder, className, Icon, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <div className="input-container">
                {Icon && <Icon className="input-icon" />}
                <input
                    type={isPasswordField && showPassword ? 'text' : type}
                    placeholder={placeholder}
                    className={`${className} ${error ? 'border-red-500' : ''}`}
                    required
                    value={value}
                    onChange={onChange}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        text=""
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default Field;