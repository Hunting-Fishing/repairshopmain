
create or replace function redeem_loyalty_reward(
  p_customer_id uuid,
  p_reward_id uuid,
  p_points_cost integer
) returns void
language plpgsql
security definer
as $$
begin
  -- Start transaction
  begin
    -- Deduct points
    update customers
    set loyalty_points = loyalty_points - p_points_cost
    where id = p_customer_id
    and loyalty_points >= p_points_cost;
    
    if not found then
      raise exception 'Insufficient points or customer not found';
    end if;

    -- Record redemption
    insert into loyalty_reward_redemptions (
      customer_id,
      reward_id,
      points_cost,
      redeemed_at
    ) values (
      p_customer_id,
      p_reward_id,
      p_points_cost,
      now()
    );

    -- Commit transaction
    commit;
  exception
    when others then
      -- Rollback transaction on error
      rollback;
      raise;
  end;
end;
$$;
