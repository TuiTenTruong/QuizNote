package com.tnntruong.quiznote.dto.response.admin;

import java.util.List;
import com.tnntruong.quiznote.dto.response.Seller.ResOrderDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResAdminOrderDTO {
    private int totalOrders;
    private int successfulOrders;
    private long totalRevenue;
    private long platformFee;
    private List<ResOrderDTO> orders;
}
