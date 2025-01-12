import React from 'react';
import { ProductInfo } from '../../types';
import './productInfo.css';

interface FilterState {
    [key: string]: string;
}

interface ProductInfoProps {
    filters: FilterState;
    handleFilterChange: (column: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    filteredProductList: ProductInfo[];
}

const ProductInfoComponent: React.FC<ProductInfoProps> = ({ 
    filters, 
    handleFilterChange, 
    filteredProductList 
}) => {
    return (
        <div className="product-info-container">
            <table className="product-info-table">
                <thead>
                    <tr>
                        <th>
                            <div>#</div>
                        </th>
                        <th>
                            <div>Seri No</div>
                            <input
                                type="text"
                                value={filters.serial_number}
                                onChange={handleFilterChange('serial_number')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Ürün Kodu</div>
                            <input
                                type="text"
                                value={filters.product_code}
                                onChange={handleFilterChange('product_code')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>CPID</div>
                            <input
                                type="text"
                                value={filters.charge_point_id}
                                onChange={handleFilterChange('charge_point_id')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Ethernet MAC</div>
                            <input
                                type="text"
                                value={filters.ethernet_mac}
                                onChange={handleFilterChange('ethernet_mac')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Bluetooth MAC</div>
                            <input
                                type="text"
                                value={filters.bluetooth_mac}
                                onChange={handleFilterChange('bluetooth_mac')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>4G IMEI</div>
                            <input
                                type="text"
                                value={filters.four_g_imei}
                                onChange={handleFilterChange('four_g_imei')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Master Kart RFID</div>
                            <input
                                type="text"
                                value={filters.master_card_rfid}
                                onChange={handleFilterChange('master_card_rfid')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Slave 1 Kart RFID</div>
                            <input
                                type="text"
                                value={filters.slave_1_card_rfid}
                                onChange={handleFilterChange('slave_1_card_rfid')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Slave 2 Kart RFID</div>
                            <input
                                type="text"
                                value={filters.slave_2_card_rfid}
                                onChange={handleFilterChange('slave_2_card_rfid')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Ürün Açıklaması</div>
                            <input
                                type="text"
                                value={filters.product_description}
                                onChange={handleFilterChange('product_description')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Bluetooth Key</div>
                            <input
                                type="text"
                                value={filters.bluetooth_key}
                                onChange={handleFilterChange('bluetooth_key')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Bluetooth IV Key</div>
                            <input
                                type="text"
                                value={filters.bluetooth_iv_key}
                                onChange={handleFilterChange('bluetooth_iv_key')}
                                placeholder="Filtrele..."
                            />
                        </th>
                        <th>
                            <div>Bluetooth Şifre</div>
                            <input
                                type="text"
                                value={filters.bluetooth_password}
                                onChange={handleFilterChange('bluetooth_password')}
                                placeholder="Filtrele..."
                            />
                        </th>
                    </tr>
                </thead>
                <tbody className="scrollable-body">
                    {filteredProductList.map((info, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{info.serial_number}</td>
                            <td>{info.product_code}</td>
                            <td>{info.charge_point_id}</td>
                            <td>{info.ethernet_mac}</td>
                            <td>{info.bluetooth_mac}</td>
                            <td>{info.four_g_imei}</td>
                            <td>{info.master_card_rfid}</td>
                            <td>{info.slave_1_card_rfid}</td>
                            <td>{info.slave_2_card_rfid}</td>
                            <td>{info.product_description}</td>
                            <td>{info.bluetooth_key}</td>
                            <td>{info.bluetooth_iv_key}</td>
                            <td>{info.bluetooth_password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductInfoComponent; 