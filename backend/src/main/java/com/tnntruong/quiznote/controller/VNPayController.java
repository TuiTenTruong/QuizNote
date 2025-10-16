package com.tnntruong.quiznote.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.VNPayService;
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
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":"
                + request.getServerPort();
        System.out.println(baseUrl);
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity GetMapping(HttpServletRequest request, Model model) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);
        long amount = Long.parseLong(request.getParameter("vnp_Amount")) / 100;

        if (paymentStatus == 1) {
            vnPayService.handleSuccessfulPayment(orderInfo, transactionId,
                    request.getParameter("vnp_PayDate"), amount);
            // phải trả về đúng chữ “OK” cho VNPay để họ ngừng gửi lại
            return ResponseEntity.ok("OK");
        }
        return ResponseEntity.ok("FAILED");
    }

    // @GetMapping("/ipn")
    // public ResponseEntity<String> ipn(HttpServletRequest request) {
    // int paymentStatus = vnPayService.orderReturn(request);

    // String orderInfo = request.getParameter("vnp_OrderInfo");
    // String transactionId = request.getParameter("vnp_TransactionNo");
    // long amount = Long.parseLong(request.getParameter("vnp_Amount")) / 100;

    // if (paymentStatus == 1) {
    // vnPayService.handleSuccessfulPayment(orderInfo, transactionId,
    // request.getParameter("vnp_PayDate"), amount);
    // // phải trả về đúng chữ “OK” cho VNPay để họ ngừng gửi lại
    // return ResponseEntity.ok("OK");
    // }
    // return ResponseEntity.ok("FAILED");
    // }
}
