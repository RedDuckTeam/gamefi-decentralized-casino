import { ActiveUsers } from '@/components/admin/admin-management/active-users.tsx';
import { AddAdmin } from '@/components/admin/admin-management/add-admin.tsx';
import { DeleteAdmin } from '@/components/admin/admin-management/delete-admin.tsx';

export const AdminManagement = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center text-4xl">Admin Management</div>
      <ActiveUsers />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AddAdmin />
        <DeleteAdmin />
      </div>
    </div>
  );
};
