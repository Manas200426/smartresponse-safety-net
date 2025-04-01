
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  UserPlus,
  Edit,
  Lock,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  CheckCheck
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'USR001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-06-15T08:30:00Z',
  },
  {
    id: 'USR002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'police',
    status: 'active',
    lastLogin: '2023-06-14T15:45:00Z',
  },
  {
    id: 'USR003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'hospital',
    status: 'active',
    lastLogin: '2023-06-14T11:20:00Z',
  },
  {
    id: 'USR004',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@example.com',
    role: 'police',
    status: 'inactive',
    lastLogin: '2023-05-30T09:15:00Z',
  },
  {
    id: 'USR005',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'hospital',
    status: 'active',
    lastLogin: '2023-06-15T10:10:00Z',
  },
  {
    id: 'USR006',
    name: 'Emma Martinez',
    email: 'emma.martinez@example.com',
    role: 'public',
    status: 'pending',
    lastLogin: '',
  },
  {
    id: 'USR007',
    name: 'David Taylor',
    email: 'david.taylor@example.com',
    role: 'police',
    status: 'active',
    lastLogin: '2023-06-13T14:25:00Z',
  },
  {
    id: 'USR008',
    name: 'Jennifer Adams',
    email: 'jennifer.adams@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-06-15T07:50:00Z',
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  
  // Filtered users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterRole = (role: UserRole | 'all') => {
    setFilterRole(role);
  };
  
  const handleEditUser = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    // In a real app, this would send a delete request to the API
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    
    toast({
      title: 'User Deleted',
      description: `User ${userId} has been deleted successfully.`,
    });
  };
  
  const handleChangeStatus = (userId: string, status: 'active' | 'inactive' | 'pending') => {
    // In a real app, this would update the user's status in the API
    const newUsers = users.map(user => 
      user.id === userId ? { ...user, status } : user
    );
    setUsers(newUsers);
    
    toast({
      title: 'Status Updated',
      description: `User ${userId} status changed to ${status}.`,
    });
  };
  
  const handleApproveUser = (userId: string) => {
    // In a real app, this would approve the pending user in the API
    const newUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'active' as const } : user
    );
    setUsers(newUsers);
    
    toast({
      title: 'User Approved',
      description: `User ${userId} has been approved and activated.`,
    });
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending Approval</Badge>;
    }
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Admin</Badge>;
      case 'police':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Police</Badge>;
      case 'hospital':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Hospital</Badge>;
      case 'public':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Public</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">
            Manage system users and access control
          </p>
        </div>
        
        <Button onClick={() => toast({ title: 'Feature Coming Soon', description: 'User creation will be available in a future update.' })}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Feature Coming Soon', description: 'Export functionality will be available in a future update.' })}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={filterRole === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterRole('all')}
              >
                All
              </Button>
              <Button 
                variant={filterRole === 'admin' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterRole('admin')}
              >
                Admin
              </Button>
              <Button 
                variant={filterRole === 'police' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterRole('police')}
              >
                Police
              </Button>
              <Button 
                variant={filterRole === 'hospital' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterRole('hospital')}
              >
                Hospital
              </Button>
              <Button 
                variant={filterRole === 'public' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterRole('public')}
              >
                Public
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            
                            {user.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleApproveUser(user.id)}>
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Approve User
                              </DropdownMenuItem>
                            )}
                            
                            {user.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleChangeStatus(user.id, 'inactive')}>
                                <Lock className="mr-2 h-4 w-4" />
                                Deactivate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleChangeStatus(user.id, 'active')}>
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users match your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {editUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="police">Police</option>
                  <option value="hospital">Hospital</option>
                  <option value="public">Public</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  value={editUser.status}
                  onChange={(e) => 
                    setEditUser({ 
                      ...editUser, 
                      status: e.target.value as 'active' | 'inactive' | 'pending' 
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // In a real app, this would update the user in the API
              const newUsers = users.map(user => 
                user.id === editUser?.id ? editUser : user
              );
              setUsers(newUsers);
              setDialogOpen(false);
              
              toast({
                title: 'User Updated',
                description: `User ${editUser?.id} has been updated successfully.`,
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
