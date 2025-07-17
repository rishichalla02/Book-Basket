const PasswordChecklist = ({ password }) => {
  const hasStartedTyping = password.length > 0;

  const rules = [
    { label: "At least 8 characters", test: password.length >= 8 },
    {
      label: "At least 1 uppercase letter (A-Z)",
      test: /[A-Z]/.test(password),
    },
    {
      label: "At least 1 lowercase letter (a-z)",
      test: /[a-z]/.test(password),
    },
    { label: "At least 1 number (0-9)", test: /\d/.test(password) },
    {
      label: "At least 1 special character (!@#$...)",
      test: /[!@#$%^&*()_+]/.test(password),
    },
  ];

  return (
      <ul className="mt-1 space-y-1">
      {hasStartedTyping &&
        rules
          .filter((rule) => rule.test) // Only show passed rules
          .map((rule, idx) => (
              <li key={idx} className="flex items-center text-sm text-black-400">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="mr-2 accent-blue-500"
              />
              {rule.label}
            </li>
          ))}
    </ul>
  );
};

export default PasswordChecklist;