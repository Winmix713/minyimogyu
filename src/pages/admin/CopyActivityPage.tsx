/**
 * CopyActivityPage - Admin page to view copy operation audit trail
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Copy, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { copyService, CopyOperationAudit } from '@/services/copy/copyService'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CopyActivityPageProps {
  // No props required for this component
}

export function CopyActivityPage({}: CopyActivityPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [operationFilter, setOperationFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [selectedOperation, setSelectedOperation] = useState<CopyOperationAudit | null>(null)
  
  const pageSize = 20

  // Fetch copy history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['copy-history', page, pageSize, statusFilter, typeFilter, operationFilter],
    queryFn: () => copyService.getCopyHistory(pageSize, page * pageSize),
    staleTime: 30000 // 30 seconds
  })

  // Fetch copy statistics
  const {
    data: stats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['copy-stats'],
    queryFn: () => copyService.getCopyStats('week'),
    staleTime: 60000 // 1 minute
  })

  // Filter operations based on search term
  const filteredOperations = historyData?.data?.filter(operation => {
    const matchesSearch = !searchTerm || 
      operation.source_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.target_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.metadata?.searchableText?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || operation.status === statusFilter
    const matchesType = typeFilter === 'all' || operation.source_type === typeFilter
    const matchesOperation = operationFilter === 'all' || operation.operation_type === operationFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesOperation
  }) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      failure: 'destructive',
      pending: 'secondary'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      job: 'bg-blue-100 text-blue-800',
      configuration: 'bg-purple-100 text-purple-800',
      dashboard: 'bg-green-100 text-green-800',
      report: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge className={cn(colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800')}>
        {type}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  const exportToCSV = () => {
    if (!filteredOperations.length) return
    
    const headers = [
      'ID', 'User ID', 'Operation Type', 'Source Type', 'Source ID', 
      'Target ID', 'Status', 'Created At', 'Completed At', 'Error Message'
    ]
    
    const rows = filteredOperations.map(op => [
      op.id,
      op.user_id,
      op.operation_type,
      op.source_type,
      op.source_id,
      op.target_id || '',
      op.status,
      op.created_at,
      op.completed_at || '',
      op.error_message || ''
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `copy-operations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Copy Activity</h1>
          <p className="text-muted-foreground">
            Monitor and audit copy/clone operations across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetchHistory()}
            disabled={isLoadingHistory}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoadingHistory && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={!filteredOperations.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOperations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.successRate ? Math.round(stats.successRate * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Operations</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.operationsByStatus?.failure || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {Object.entries(stats?.operationsByType || { } as Record<string, number>)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most cloned type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="configuration">Configuration</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Operation</Label>
              <Select value={operationFilter} onValueChange={setOperationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All operations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operations</SelectItem>
                  <SelectItem value="copy">Copy</SelectItem>
                  <SelectItem value="clone">Clone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setOperationFilter('all')
                  setPage(0)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
          <CardDescription>
            Showing {filteredOperations.length} of {historyData?.count || 0} operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading operations...
            </div>
          ) : filteredOperations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No copy operations found matching the current filters
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Source ID</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>{getStatusBadge(operation.status)}</TableCell>
                      <TableCell>{getTypeBadge(operation.source_type)}</TableCell>
                      <TableCell className="capitalize">{operation.operation_type}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 rounded">
                          {operation.source_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        {operation.target_id ? (
                          <code className="text-xs bg-muted px-1 rounded">
                            {operation.target_id}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 rounded">
                          {operation.user_id.substring(0, 8)}...
                        </code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(operation.created_at)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOperation(operation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Operation Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about this copy operation
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedOperation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Operation ID</Label>
                                    <p className="text-sm font-mono">{selectedOperation.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedOperation.status)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Operation Type</Label>
                                    <p className="text-sm capitalize">{selectedOperation.operation_type}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Source Type</Label>
                                    <p className="text-sm capitalize">{selectedOperation.source_type}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Source ID</Label>
                                    <p className="text-sm font-mono">{selectedOperation.source_id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Target ID</Label>
                                    <p className="text-sm font-mono">{selectedOperation.target_id || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Created</Label>
                                    <p className="text-sm">{formatDate(selectedOperation.created_at)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Completed</Label>
                                    <p className="text-sm">
                                      {selectedOperation.completed_at 
                                        ? formatDate(selectedOperation.completed_at)
                                        : 'N/A'
                                      }
                                    </p>
                                  </div>
                                </div>
                                
                                {selectedOperation.error_message && (
                                  <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                      <div className="font-medium mb-1">Error Message</div>
                                      <p className="text-sm">{selectedOperation.error_message}</p>
                                    </AlertDescription>
                                  </Alert>
                                )}
                                
                                {selectedOperation.payload && (
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Payload</Label>
                                    <ScrollArea className="h-32">
                                      <pre className="text-xs bg-muted p-3 rounded-lg">
                                        {JSON.stringify(selectedOperation.payload, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}
                                
                                {selectedOperation.metadata && Object.keys(selectedOperation.metadata).length > 0 && (
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Metadata</Label>
                                    <ScrollArea className="h-32">
                                      <pre className="text-xs bg-muted p-3 rounded-lg">
                                        {JSON.stringify(selectedOperation.metadata, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {historyData && historyData.count > pageSize && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, filteredOperations.length)} of {historyData.count} operations
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page + 1} of {Math.ceil(historyData.count / pageSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * pageSize >= historyData.count}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}