import { fetcher } from "@/lib/coingecko.actions";
import React from "react";
import Datatable from "../Datatable";
import Image from "next/image";
import { cn, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const Categories =  async () =>{
    const categories = await fetcher<Category[]>('/coins/categories');
    const columns:DataTableColumn<Category>[]=[
        {header:'Category', cellClassName:'category-cell',cell:(category)=> category.name},
        {header:'Top Gainers', cellClassName:'top-gainers-cell', cell:(category)=> 
            category.top_3_coins.map((coin)=>(
                <Image src={coin} alt={coin} key={coin} height={28} width={28}/> 
            )),
        },
        {header:'24h Change', cellClassName:'change-header-cell',
            cell: (category) => {
				
				const isTrendingUp = category.market_cap_change_24h > 0;
				return (
					<div
						className={cn(
							"change-cell",
							isTrendingUp ? "text-green-500" : "text-red-500"
						)}>

						<p className="flex items-center">
                            {formatPercentage(category.market_cap_change_24h)}
							{isTrendingUp ? (
								<TrendingUp width={16} height={16} />
							) : (
								<TrendingDown width={16} height={16} />
							)}
                           
						</p>
					</div>
				);
			},
        },
        {header:'Market Cap', cellClassName:'market-cap-cell', 
            cell:(category)=>formatCurrency(category.market_cap)},
        {header:'24h Volume', cellClassName:'volumr-cell', 
            cell:(category)=>formatCurrency(category.volume_24h)},
    ];
    return <div id="categories" className="custom-scrollbar">
        <h4>Top Categories</h4>
        <Datatable 
        columns={columns} 
        data={categories?.slice(0,10)} 
        rowKey={(_,index)=> index}
        tableClassName="mt-3"/>
    </div>
};

export default Categories;