const Button = ({ onClick, text, Icon, type = 'button', className = '', disabled = false, ...props}) => {
    return (
        <button
            {...props}
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            <span className="btn-icon">{Icon && <Icon className=" w-4 h-4, max-[1000px]:w-4 h-4, max-[350px]:w-2 h-2 mt-1" />}</span>
            <span className="btn-text">{text}</span>
        </button>
    );
};

export default Button;
