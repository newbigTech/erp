<template>
    <div>
        <table class="template" v-for="(item, index) in formData">
            <tr>
                <td style="width:300px;text-align: right">
                    <span><a class="operate" :href="item.channel_item_link" target="_blank">{{item.channel_item_id}}</a></span>
                </td>
                <td>
                    <div class="inline fl t-left" v-if="channel_name==='ebay'">
                        <p class="inline t-left ml-sm">
                            <img src="../../../assets/good.png" v-if="item.comment_type===1" title="好评">
                            <img src="../../../assets/centre.png" v-else-if="item.comment_type===2" title="中评">
                            <img src="../../../assets/bad.png" v-else-if="item.comment_type===3" title="差评">
                            <img src="../../../assets/stay.png" v-else-if="item.comment_type===0" title="等待买家评价">
                        </p>
                        <p class="inline t-left ml-sm">
                            <img src="../../../assets/wait.png" v-if="item.comment_type===0" title="未评价">
                            <img src="../../../assets/yet.png" v-else title="已评价">
                        </p>
                    </div>

                    <p class="inline fr" v-if="channel_name==='ebay' && showBtn">
                        <span class="operate mr-sm" @click="contact_buyer(1,index)">联系买家</span>
                        <span class="operate mr-sm" @click="message_buyer(1,index)">回评</span>
                        <el-button class="operate mr-sm" type="text" size="mini" :disabled="hasShippingTime" @click="cancelOrder" style="color: #69f">取消订单</el-button>
                    </p>

                    <p class="inline fr" v-else-if="channel_name==='aliExpress' && showBtn">
                        <span class="operate mr-sm" @click="contact_buyer(4,index,item)">联系买家</span>
                        <el-button class="operate mr-sm" type="text"  size="mini" :disabled="hasShippingTime" @click="cancelOrder" style="color: #69f">取消订单</el-button>
                    </p>

                    <p class="inline fr" v-else-if="channel_name==='wish' && showBtn">
                        <el-button class="operate mr-sm" type="text" size="mini" :disabled="hasShippingTime" @click="cancelOrder" style="color: #69f">取消订单</el-button>
                    </p>
                    <p class="inline fr" v-else-if="channel_name==='amazon' && showBtn">
                        <span class="operate mr-sm" @click="contact_buyer(2,index,item)">联系买家</span>
                        <el-button class="operate mr-sm" type="text" size="mini" :disabled="hasShippingTime" style="color: #69f">取消订单</el-button>
                    </p>
                </td>
            </tr>
        </table>

        <contact-buyer v-model="contactVisible" :order_id="order_id" :channel_id="channel_id"
                       :mdfid="mdfid"></contact-buyer>
        <message v-model="messageVisible" :order_id="order_id" @review="review" :index="index" :mdfid="mdfid"
                 :channel_id="channel_id"></message>
    </div>
</template>

<style lang="stylus">

</style>
<script>
    import {api_amazon_list,api_cancel_order} from "../../../api/letter-amazon"
    import {api_smt_list} from '../../../api/smt-mail'

    export default {
        data() {
            return {
                channel_id: '',
                contactVisible: false,
                messageVisible: false,
                index: 0
            }
        },
        created() {

        },
        filters: {},
        mounted() {

        },
        updated() {

        },
        destroy() {

        },
        methods: {
            cancelOrder(){
                this.$confirm(`您将取消订单?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_cancel_order,{order_id:this.cancelId}).then(res=>{
                        if(res.cancel_status === 1){
                            this.$message({type:'success',message:res.message})
                        }else {
                            this.$message({type:'error',message:res.message})
                        }
                    }).catch((err)=>{
                        this.$message({type:'error',message:err.message})
                    })
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消'
                    })
                })

            },
            init() {

            },
            contact_buyer(id, index,item) {
                if (id === 2) {
                    let params = {
                        pageSize: 50,
                        page: 1,
                        customer_id: '',
                        account_code: '',
                        box_id: '',
                        is_replied: '',
                        is_read: '',
                        time_field: 'sync_time',
                        time_start: '',
                        time_end: '',
                        option_field: "system_order_number",
                        option_value: this.ordersNumber,
                        order_status: '',
                    };
                    this.$http(api_amazon_list, params).then(res => {
                        if (res && res.data && res.data.length > 0) {
                            this.$open('/amazon-emails', {
                                ordersNumber: this.ordersNumber,
                                channel_item_id: item.channel_item_id,
                                resData: res
                            });
                        } else {
                            this.$open('/amazon-emails/sent-emails/send', {
                                ordersNumber: this.ordersNumber,
                                channel_item_id: item.channel_item_id
                            });
                        }
                    }).catch(code => {
                        console.log(code, 'code');
                    });
                }else if(id===4){
                    let data = {
                        page: 1,
                        pageSize: 50,
                        filter_type: 'order_id',
                        filter_text: this.ordersNumber,
                        customer_id: '',
                        status: '',
                        rank: -1,
                        msg_type: '',
                        read: '',
                        sort: 1,
                        account_id: ''
                    };
                    this.$http(api_smt_list,data).then(res=>{
                        if(res.data&&res.data.length>0){
                            this.$open('/aliexpress-msg',{ordersNumber:this.ordersNumber,channel_item_id:item.channel_item_id,resData:res});
                        }else{
                            this.channel_id = id;
                            this.contactVisible = true;
                        }
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                } else {
                    this.channel_id = id;
                    this.contactVisible = true;
                }
            },
            review(index) {
                this.formData[index].comment_type = 1;
                this.$emit('review')
            },
            message_buyer(id, index) {
                this.channel_id = id;
                if (this.formData[index].comment_type !== 0) {
                    this.$message({
                        type: "error",
                        message: "已有评价"
                    });
                    return
                }
                this.index = index;
                this.messageVisible = true;
            },
        },
        computed: {},
        watch: {},
        props: {
            cancelid:{},
            hasShippingTime:{
                type:Boolean,
                default(){
                    return false
                }
            },
            showBtn: {
                default() {
                    return true
                }
            },
            formData: {//评价状态
                required: true
            },
            channel_name: {//平台名称
                required: true,
                type: String

            },
            ordersNumber: {},
            order_id: {//商品id
                required: true
            },
            mdfid: {}
        },
        components: {
            contactBuyer: require('./contact-buyer.vue').default,
            message: require('./message.vue').default,
        }
    }
</script>

