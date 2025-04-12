
import { Dumbbell } from "lucide-react";

const LoginHeader = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2">
        <Dumbbell className="h-10 w-10 text-fitBlue-600" />
        <h1 className="text-3xl font-bold text-fitBlue-800">Fit Manager</h1>
      </div>
    </div>
  );
};

export default LoginHeader;
