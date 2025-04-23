import React, { useState, useEffect } from 'react';
import { NavigationWrapper } from '@/components/NavigationWrapper';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Download, 
  FileText, 
  Edit, 
  X, 
  ChevronDown, 
  ChevronRight,
  FileCog,
  Percent,
  DollarSign
} from 'lucide-react';

// Interface for Fee Schedule Item
interface FeeScheduleItem {
  cdtCode: string;
  fullDescription: string;
  shortDescription: string;
  category: string;
  standardFee: number;
  ppoFee: number;
}

const categories = [
  "All Categories",
  "Diag / Img",
  "Prev",
  "Rest / Prosth • Direct",
  "Rest / Prosth • Indirect",
  "Endo",
  "Perio",
  "Oral Surgery",
  "Ortho",
  "Adjunctive"
];

// Sample data from CSV file
const feeScheduleData: FeeScheduleItem[] = [
  {
    cdtCode: "D0120",
    fullDescription: "periodic oral evaluation - established patient",
    shortDescription: "Periodic Oral Eval - Est Patient",
    category: "Diag / Img",
    standardFee: 65.0,
    ppoFee: 52.0
  },
  {
    cdtCode: "D0140",
    fullDescription: "limited oral evaluation - problem focused",
    shortDescription: "Limited Oral Eval - Problem",
    category: "Diag / Img",
    standardFee: 90.0,
    ppoFee: 72.0
  },
  {
    cdtCode: "D0150",
    fullDescription: "comprehensive oral evaluation - new or established patient",
    shortDescription: "Comprehensive Oral Eval",
    category: "Diag / Img",
    standardFee: 105.0,
    ppoFee: 84.0
  },
  {
    cdtCode: "D0210",
    fullDescription: "intraoral - complete series of radiographic images",
    shortDescription: "FMX",
    category: "Diag / Img",
    standardFee: 140.0,
    ppoFee: 112.0
  },
  {
    cdtCode: "D0272",
    fullDescription: "bitewings - two radiographic images",
    shortDescription: "BW - 2 Films",
    category: "Diag / Img",
    standardFee: 40.0,
    ppoFee: 32.0
  },
  {
    cdtCode: "D0274",
    fullDescription: "bitewings - four radiographic images",
    shortDescription: "BW - 4 Films",
    category: "Diag / Img",
    standardFee: 55.0,
    ppoFee: 44.0
  },
  {
    cdtCode: "D0330",
    fullDescription: "panoramic radiographic image",
    shortDescription: "Panoramic",
    category: "Diag / Img",
    standardFee: 130.0,
    ppoFee: 104.0
  },
  {
    cdtCode: "D1110",
    fullDescription: "prophylaxis - adult",
    shortDescription: "Adult Prophy",
    category: "Prev",
    standardFee: 115.0,
    ppoFee: 92.0
  },
  {
    cdtCode: "D1120",
    fullDescription: "prophylaxis - child",
    shortDescription: "Child Prophy",
    category: "Prev",
    standardFee: 90.0,
    ppoFee: 72.0
  },
  {
    cdtCode: "D1206",
    fullDescription: "topical application of fluoride varnish",
    shortDescription: "Fluoride Varnish",
    category: "Prev",
    standardFee: 45.0,
    ppoFee: 36.0
  },
  {
    cdtCode: "D1351",
    fullDescription: "sealant - per tooth",
    shortDescription: "Sealant Per Tooth",
    category: "Prev",
    standardFee: 60.0,
    ppoFee: 48.0
  },
  {
    cdtCode: "D2330",
    fullDescription: "resin-based composite - one surface, anterior",
    shortDescription: "Composite Ant 1S",
    category: "Rest / Prosth • Direct",
    standardFee: 180.0,
    ppoFee: 144.0
  },
  {
    cdtCode: "D2331",
    fullDescription: "resin-based composite - two surfaces, anterior",
    shortDescription: "Composite Ant 2S",
    category: "Rest / Prosth • Direct",
    standardFee: 215.0,
    ppoFee: 172.0
  },
  {
    cdtCode: "D2391",
    fullDescription: "resin-based composite - one surface, posterior",
    shortDescription: "Composite Post 1S",
    category: "Rest / Prosth • Direct",
    standardFee: 185.0,
    ppoFee: 148.0
  },
  {
    cdtCode: "D2392",
    fullDescription: "resin-based composite - two surfaces, posterior",
    shortDescription: "Composite Post 2S",
    category: "Rest / Prosth • Direct",
    standardFee: 235.0,
    ppoFee: 188.0
  },
  {
    cdtCode: "D2740",
    fullDescription: "crown - porcelain/ceramic",
    shortDescription: "Crown - Porcelain/Ceramic",
    category: "Rest / Prosth • Indirect",
    standardFee: 1350.0,
    ppoFee: 1080.0
  },
  {
    cdtCode: "D2750",
    fullDescription: "crown - porcelain fused to high noble metal",
    shortDescription: "Crown - PFM High Noble",
    category: "Rest / Prosth • Indirect",
    standardFee: 1250.0,
    ppoFee: 1000.0
  },
  {
    cdtCode: "D3310",
    fullDescription: "endodontic therapy, anterior tooth (excluding final restoration)",
    shortDescription: "RCT - Anterior",
    category: "Endo",
    standardFee: 950.0,
    ppoFee: 760.0
  },
  {
    cdtCode: "D3320",
    fullDescription: "endodontic therapy, premolar tooth (excluding final restoration)",
    shortDescription: "RCT - Premolar",
    category: "Endo",
    standardFee: 1100.0,
    ppoFee: 880.0
  },
  {
    cdtCode: "D3330",
    fullDescription: "endodontic therapy, molar tooth (excluding final restoration)",
    shortDescription: "RCT - Molar",
    category: "Endo",
    standardFee: 1350.0,
    ppoFee: 1080.0
  },
  {
    cdtCode: "D4341",
    fullDescription: "periodontal scaling and root planing - four or more teeth per quadrant",
    shortDescription: "SRP 4+ teeth per quad",
    category: "Perio",
    standardFee: 275.0,
    ppoFee: 220.0
  },
  {
    cdtCode: "D4910",
    fullDescription: "periodontal maintenance",
    shortDescription: "Perio Maintenance",
    category: "Perio",
    standardFee: 145.0,
    ppoFee: 116.0
  }
];

// Main component
export default function FeeSchedulesPage() {
  const [selectedTab, setSelectedTab] = useState('standard');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  // Function to filter fee schedule data
  const getFilteredFees = () => {
    let filtered = [...feeScheduleData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.cdtCode.toLowerCase().includes(query) ||
        fee.shortDescription.toLowerCase().includes(query) ||
        fee.fullDescription.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(fee => fee.category === selectedCategory);
    }

    return filtered;
  };

  const filteredFees = getFilteredFees();

  // Handle row expansion toggle
  const toggleRowExpand = (cdtCode: string) => {
    setExpandedRows(prev => {
      if (prev.includes(cdtCode)) {
        return prev.filter(code => code !== cdtCode);
      } else {
        return [...prev, cdtCode];
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (cdtCode: string) => {
    setSelectedFees(prev => {
      if (prev.includes(cdtCode)) {
        return prev.filter(code => code !== cdtCode);
      } else {
        return [...prev, cdtCode];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedFees.length === filteredFees.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees(filteredFees.map(fee => fee.cdtCode));
    }
  };

  // Render count badge for tabs
  const renderTabBadge = (count: number) => (
    <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
      {count}
    </Badge>
  );

  // Calculate total count by category
  const getCategoryCount = (category: string) => {
    if (category === 'All Categories') {
      return feeScheduleData.length;
    }
    return feeScheduleData.filter(fee => fee.category === category).length;
  };

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Fee Schedules</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Standard Fee Schedule</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{feeScheduleData.length}</div>
                    <div className="text-sm text-muted-foreground">Total CDT Codes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">PPO Fee Schedule</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <Percent className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">20%</div>
                    <div className="text-sm text-muted-foreground">Average discount</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Export and analyze fee schedules</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="h-9 flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Export Schedule
                    </Button>
                    <Button variant="outline" className="h-9 flex-1">
                      <FileCog className="h-4 w-4 mr-1" />
                      Fee Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>CDT Code Fee Schedules</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedFees.length === 0}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Selected
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedFees.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Selected
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="standard" className="w-full" onValueChange={setSelectedTab}>
                <div className="border-b px-6 py-3">
                  <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                    <TabsTrigger value="standard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Standard Fees
                    </TabsTrigger>
                    <TabsTrigger value="ppo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      PPO Fees
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Filter bar */}
                <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-card border-b">
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-[220px] h-9">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category} {category !== 'All Categories' && renderTabBadge(getCategoryCount(category))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search CDT code or description"
                      className="pl-9 pr-4 h-9 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter chips */}
                {(selectedCategory !== 'All Categories' || searchQuery) && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredFees.length}</span>
                    
                    {selectedCategory !== 'All Categories' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {selectedCategory} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('All Categories')} />
                      </Badge>
                    )}
                    
                    {searchQuery && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        "{searchQuery}" <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                      </Badge>
                    )}
                    
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                      setSelectedCategory('All Categories');
                      setSearchQuery('');
                    }}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Selected fees count */}
                {selectedFees.length > 0 && (
                  <div className="px-6 py-2 bg-card border-b text-sm">
                    <span>{selectedFees.length} out of {filteredFees.length} selected</span>
                  </div>
                )}

                {/* Fee Schedule Table */}
                <TabsContent value="standard" className="p-0 border-0">
                  <div className="w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredFees.length > 0 && selectedFees.length === filteredFees.length} 
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all fees"
                            />
                          </TableHead>
                          <TableHead className="w-[120px]">CDT Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Standard Fee ($)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFees.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-32">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-2" />
                                <p>No fee schedule items match your filter criteria</p>
                                <Button 
                                  variant="link" 
                                  className="mt-2"
                                  onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All Categories');
                                  }}
                                >
                                  Clear all filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {filteredFees.map((fee) => (
                              <React.Fragment key={fee.cdtCode}>
                                <TableRow className={selectedFees.includes(fee.cdtCode) ? "bg-muted/50" : ""}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedFees.includes(fee.cdtCode)} 
                                      onCheckedChange={() => handleRowSelect(fee.cdtCode)}
                                      aria-label={`Select ${fee.cdtCode}`}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{fee.cdtCode}</TableCell>
                                  <TableCell>
                                    {fee.shortDescription || fee.fullDescription.substring(0, 60) + (fee.fullDescription.length > 60 ? '...' : '')}
                                  </TableCell>
                                  <TableCell>{fee.category}</TableCell>
                                  <TableCell className="text-right">${fee.standardFee.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => toggleRowExpand(fee.cdtCode)}
                                      aria-label={expandedRows.includes(fee.cdtCode) ? "Collapse row" : "Expand row"}
                                    >
                                      {expandedRows.includes(fee.cdtCode) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                
                                {/* Expanded row content */}
                                {expandedRows.includes(fee.cdtCode) && (
                                  <TableRow className="bg-muted/30">
                                    <TableCell colSpan={6} className="p-0">
                                      <div className="p-4">
                                        <div className="rounded-md border">
                                          <div className="p-4">
                                            <h4 className="font-semibold mb-2">{fee.cdtCode} - Full Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Full Description:</p>
                                                <p className="text-sm">{fee.fullDescription}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Short Description:</p>
                                                <p className="text-sm">{fee.shortDescription || 'N/A'}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Category:</p>
                                                <p className="text-sm">{fee.category}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Pricing:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                    <p className="text-xs text-muted-foreground">Standard Fee:</p>
                                                    <p className="text-sm font-medium">${fee.standardFee.toFixed(2)}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-xs text-muted-foreground">PPO Fee:</p>
                                                    <p className="text-sm font-medium">${fee.ppoFee.toFixed(2)}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="mt-4 flex justify-end space-x-2">
                                              <Button variant="outline" size="sm">
                                                <Edit className="h-3.5 w-3.5 mr-1" />
                                                Edit Fee
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="ppo" className="p-0 border-0">
                  <div className="w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredFees.length > 0 && selectedFees.length === filteredFees.length} 
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all fees"
                            />
                          </TableHead>
                          <TableHead className="w-[120px]">CDT Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">PPO Fee ($)</TableHead>
                          <TableHead className="text-right">Discount (%)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFees.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-32">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-2" />
                                <p>No fee schedule items match your filter criteria</p>
                                <Button 
                                  variant="link" 
                                  className="mt-2"
                                  onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All Categories');
                                  }}
                                >
                                  Clear all filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {filteredFees.map((fee) => (
                              <React.Fragment key={fee.cdtCode}>
                                <TableRow className={selectedFees.includes(fee.cdtCode) ? "bg-muted/50" : ""}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedFees.includes(fee.cdtCode)} 
                                      onCheckedChange={() => handleRowSelect(fee.cdtCode)}
                                      aria-label={`Select ${fee.cdtCode}`}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{fee.cdtCode}</TableCell>
                                  <TableCell>
                                    {fee.shortDescription || fee.fullDescription.substring(0, 60) + (fee.fullDescription.length > 60 ? '...' : '')}
                                  </TableCell>
                                  <TableCell>{fee.category}</TableCell>
                                  <TableCell className="text-right">${fee.ppoFee.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">
                                    {((1 - (fee.ppoFee / fee.standardFee)) * 100).toFixed(0)}%
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => toggleRowExpand(fee.cdtCode)}
                                      aria-label={expandedRows.includes(fee.cdtCode) ? "Collapse row" : "Expand row"}
                                    >
                                      {expandedRows.includes(fee.cdtCode) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                
                                {/* Expanded row content */}
                                {expandedRows.includes(fee.cdtCode) && (
                                  <TableRow className="bg-muted/30">
                                    <TableCell colSpan={7} className="p-0">
                                      <div className="p-4">
                                        <div className="rounded-md border">
                                          <div className="p-4">
                                            <h4 className="font-semibold mb-2">{fee.cdtCode} - Full Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Full Description:</p>
                                                <p className="text-sm">{fee.fullDescription}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Short Description:</p>
                                                <p className="text-sm">{fee.shortDescription || 'N/A'}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Category:</p>
                                                <p className="text-sm">{fee.category}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Pricing:</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                    <p className="text-xs text-muted-foreground">Standard Fee:</p>
                                                    <p className="text-sm font-medium">${fee.standardFee.toFixed(2)}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-xs text-muted-foreground">PPO Fee:</p>
                                                    <p className="text-sm font-medium">${fee.ppoFee.toFixed(2)}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-xs text-muted-foreground">Discount:</p>
                                                    <p className="text-sm font-medium">
                                                      {((1 - (fee.ppoFee / fee.standardFee)) * 100).toFixed(0)}%
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="mt-4 flex justify-end space-x-2">
                                              <Button variant="outline" size="sm">
                                                <Edit className="h-3.5 w-3.5 mr-1" />
                                                Edit Fee
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}