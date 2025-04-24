import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLE_CONFIGS, UserRole } from '../types';
import { 
  Building,
  Receipt,
  Stethoscope,
  Toothbrush,
  UserCheck
} from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  // Function to get the icon component based on the role
  const getIcon = (role: UserRole) => {
    switch (role) {
      case 'frontOffice':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'hygienist':
        return <Toothbrush className="h-4 w-4 text-teal-600" />;
      case 'provider':
        return <Stethoscope className="h-4 w-4 text-indigo-600" />;
      case 'billing':
        return <Receipt className="h-4 w-4 text-amber-600" />;
      case 'owner':
        return <Building className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  // Function to get the role title
  const getRoleTitle = (role: UserRole) => {
    return ROLE_CONFIGS[role].title;
  };

  return (
    <div className="mb-6 flex items-center">
      <span className="mr-3 text-sm text-gray-600">View as:</span>
      <Select
        value={currentRole}
        onValueChange={(value) => onRoleChange(value as UserRole)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Choose a role</SelectLabel>
            {Object.keys(ROLE_CONFIGS).map((role) => (
              <SelectItem key={role} value={role} className="flex items-center">
                <div className="flex items-center">
                  <span className="mr-2">{getIcon(role as UserRole)}</span>
                  <span>{getRoleTitle(role as UserRole)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;