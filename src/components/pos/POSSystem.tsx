"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import POSInterface from './POSInterface';
import InventoryManagement from './InventoryManagement2';
import { ShoppingCart, Package } from 'lucide-react';

const POSSystem: React.FC = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Point of Sale
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package size={20} />
            Inventory
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pos" className="mt-0">
          <POSInterface />
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-0">
          <InventoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default POSSystem;