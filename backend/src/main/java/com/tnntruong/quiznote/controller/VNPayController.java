package com.tnntruong.quiznote.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.tnntruong.quiznote.service.VNPayService;
import com.tnntruong.quiznote.service.request.ReqVNPayDTO;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/payments/vnpay")
public class VNPayController {
    private final VNPayService vnPayService;

    public VNPayController(VNPayService vnPayService) {
        this.vnPayService = vnPayService;
    }

    @GetMapping("")
    public String home() {
        return "index";
    }

    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        System.out.println(baseUrl);
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public String GetMapping(HttpServletRequest request, Model model) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        return paymentStatus == 1 ? "ordersuccess" : "orderfail";
    }
    // Return URL (user được chuyển về)
    // @GetMapping("/vnpay-return")
    // @ResponseBody
    // public String vnpayReturn(@RequestParam Map<String, String[]> params) {
    // PaymentResult pr = vnPayService.handleReturn(params);
    // return pr.isSuccess() ? "Payment success" : "Payment failed (code=" +
    // pr.responseCode + ")";
    // }

    // // IPN URL (VNPay gọi server-to-server)
    // @GetMapping("/vnpay-ipn")
    // @ResponseBody
    // public String vnpayIpn(@RequestParam Map<String, String[]> params) {
    // return vnPayService.handleIpn(params);
    // }
}
